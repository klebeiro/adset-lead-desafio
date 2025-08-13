using adset_api.Domain.Enums;

namespace adset_api.Application.DTOs
{
    public class VehicleCreateDto
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string LicensePlate { get; set; }
        public string Color { get; set; }
        public decimal Price { get; set; }
        public EICarrosPackageTier? IdICarrosPackageTier { get; set; }
        public EWebmotorsPackageTier? IdWebmotorsPackageTier { get; set; }
        public int? Mileage { get; set; }
        public List<int>? FeatureIds { get; set; } 
        public List<string>? PhotoUrls { get; set; }
    }
}