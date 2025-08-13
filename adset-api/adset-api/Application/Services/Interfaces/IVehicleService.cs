using adset_api.Application.DTOs;
using adset_api.Application.Filters;

namespace adset_api.Application.Services.Interfaces
{
    public interface IVehicleService
    {
        Task<IEnumerable<VehicleResponseDto>> GetVehiclesAsync(VehicleFilter? filter = null);
        Task<VehicleStatsDto> GetVehicleStatsAsync();
        Task<VehicleResponseDto?> GetVehicleByIdAsync(int id);
        Task<VehicleResponseDto> CreateVehicleAsync(VehicleCreateDto dto);
        Task<VehicleResponseDto> UpdateVehicleAsync(int id, VehicleUpdateDto dto);
        Task<VehicleResponseDto> SetVehiclePackageAsync(int id, SetPackageDto dto);
        Task<bool> DeleteVehicleAsync(int id);
        Task<IEnumerable<string>> GetDistinctColorsAsync();
    }
}