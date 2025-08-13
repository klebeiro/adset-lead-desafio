namespace adset_api.Application.Filters
{
    public class VehicleFilter
    {
        public int? YearMin { get; set; }
        public int? YearMax { get; set; }
        public string? PriceRange { get; set; }
        public bool? WithPhotos { get; set; }
        public string? Color { get; set; }
        public string? LicensePlate { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? Feature { get; set; } 
    }
}
