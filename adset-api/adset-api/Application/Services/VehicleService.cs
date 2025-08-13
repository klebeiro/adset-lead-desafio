using adset_api.Application.DTOs;
using adset_api.Application.Errors;
using adset_api.Application.Filters;
using adset_api.Application.Services.Interfaces;
using adset_api.Domain.Entities;
using adset_api.Domain.Enums;
using adset_api.Infra.Repositories.Interfaces;
using AutoMapper;

namespace adset_api.Application.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IMapper _mapper;

        public VehicleService(IVehicleRepository vehicleRepository, IMapper mapper)
        {
            _vehicleRepository = vehicleRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<VehicleResponseDto>> GetVehiclesAsync(VehicleFilter? filter = null)
        {
            var entities = await _vehicleRepository.GetAsync(filter);
            return _mapper.Map<IEnumerable<VehicleResponseDto>>(entities);
        }

        public async Task<VehicleStatsDto> GetVehicleStatsAsync()
        {
            return await _vehicleRepository.GetStatsAsync();
        }

        public async Task<VehicleResponseDto?> GetVehicleByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException(ErrorMessages.Vehicle.InvalidIdForQuery);

            var entity = await _vehicleRepository.GetByIdAsync(id);
            return entity is null ? null : _mapper.Map<VehicleResponseDto>(entity);
        }

        public async Task<VehicleResponseDto> CreateVehicleAsync(VehicleCreateDto dto)
        {
            if (dto == null)
                throw new ArgumentException(ErrorMessages.Vehicle.InvalidVehicle);

            var entity = _mapper.Map<Vehicle>(dto);
            entity.ValidateCoreFields();

            entity.UpdatePhotos(dto.PhotoUrls);
            entity.UpdateFeatures(dto.FeatureIds);

            var created = await _vehicleRepository.CreateAsync(entity);
            return _mapper.Map<VehicleResponseDto>(created);
        }

        public async Task<VehicleResponseDto> UpdateVehicleAsync(int id, VehicleUpdateDto dto)
        {
            if (id <= 0)
                throw new ArgumentException(ErrorMessages.Vehicle.InvalidIdForUpdate);
            if (dto == null)
                throw new ArgumentException(ErrorMessages.Vehicle.InvalidUpdateData);

            var current = await _vehicleRepository.GetByIdAsync(id);
            if (current == null)
                throw new ArgumentException(ErrorMessages.Vehicle.NotFound);

            _mapper.Map(dto, current);
            current.ValidateCoreFields();

            current.UpdatePhotos(dto.PhotoUrls);
            current.UpdateFeatures(dto.FeatureIds);

            var updated = await _vehicleRepository.UpdateAsync(current);
            return _mapper.Map<VehicleResponseDto>(updated);
        }

        public async Task<VehicleResponseDto> SetVehiclePackageAsync(int id, SetPackageDto dto)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(id);
            if (vehicle == null)
                throw new KeyNotFoundException(ErrorMessages.Vehicle.NotFound);

            vehicle.IdICarrosPackageTier = dto.ICarrosPackageTier;
            vehicle.IdWebmotorsPackageTier = dto.WebmotorsPackageTier;

            var updated = await _vehicleRepository.UpdateAsync(vehicle);
            return _mapper.Map<VehicleResponseDto>(updated);
        }

        public async Task<bool> DeleteVehicleAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException(ErrorMessages.Vehicle.InvalidIdForDelete);

            return await _vehicleRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<string>> GetDistinctColorsAsync()
        {
            return await _vehicleRepository.GetDistinctColorsAsync();
        }
    }
}