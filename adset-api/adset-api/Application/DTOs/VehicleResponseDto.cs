using adset_api.Domain.Enums;

namespace adset_api.Application.DTOs
{
    public class VehicleResponseDto
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string LicensePlate { get; set; }
        public int? Mileage { get; set; }
        public string Color { get; set; }
        public decimal Price { get; set; }
        public EICarrosPackageTier? IdICarrosPackageTier { get; set; }
        public EWebmotorsPackageTier? IdWebmotorsPackageTier { get; set; }
        public List<VehicleFeatureDto> Features { get; set; } = new();
        public List<VehiclePhotoDto> Photos { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}