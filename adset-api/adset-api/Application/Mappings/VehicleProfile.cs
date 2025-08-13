using AutoMapper;
using adset_api.Domain.Entities;
using adset_api.Application.DTOs;

namespace adset_api.Application.Mappings
{
    public class VehicleProfile : Profile
    {
        public VehicleProfile()
        {
            CreateMap<Vehicle, VehicleResponseDto>();

            CreateMap<VehicleCreateDto, Vehicle>();

            CreateMap<VehicleUpdateDto, Vehicle>();

            CreateMap<VehicleFeature, VehicleFeatureDto>()
            .ForMember(d => d.FeatureName, o => o.MapFrom(src => src.IdFeature.ToString()));

            CreateMap<VehiclePhoto, VehiclePhotoDto>();
        }
    }
}