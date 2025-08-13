using adset_api.Application.Errors;
using adset_api.Domain.Enums;

namespace adset_api.Domain.Entities
{
    public class Vehicle
    {
        public int Id { get; private set; }
        public string Brand { get; private set; }
        public string Model { get; private set; }
        public int Year { get; private set; }
        public string LicensePlate { get; private set; }
        public int? Mileage { get; private set; }
        public string Color { get; private set; }
        public decimal Price { get; private set; }
        public List<VehiclePhoto> Photos { get; private set; } = new List<VehiclePhoto>();
        public List<VehicleFeature> Features { get; private set; } = new List<VehicleFeature>();
        public EICarrosPackageTier? IdICarrosPackageTier { get; set; }
        public EWebmotorsPackageTier? IdWebmotorsPackageTier { get; set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;

        private const int MaxPhotos = 15;
        private static readonly int[] AllowedYears = Enumerable.Range(2000, 2024 - 2000 + 1).ToArray();

        private Vehicle() { }

        public Vehicle(string brand, string model, int year, string licensePlate, string color, decimal price)
        {
            Brand = brand;
            Model = model;
            Year = year;
            LicensePlate = licensePlate;
            Color = color;
            Price = price;
            CreatedAt = DateTime.Now;
        }

        /// <summary>
        /// Atualiza os dados básicos do veículo
        /// </summary>
        public void UpdateBasicInfo(string brand, string model, int year, string licensePlate, string color, decimal price, int? mileage)
        {
            Brand = brand;
            Model = model;
            Year = year;
            LicensePlate = licensePlate;
            Color = color;
            Price = price;
            Mileage = mileage;
        }

        /// <summary>
        /// Valida os campos obrigatórios e regras de negócio básicas da entidade
        /// </summary>
        public void ValidateCoreFields()
        {
            if (string.IsNullOrWhiteSpace(Brand))
                throw new ArgumentException(ErrorMessages.Vehicle.MissingBrand);
            if (string.IsNullOrWhiteSpace(Model))
                throw new ArgumentException(ErrorMessages.Vehicle.MissingModel);
            if (Year <= 0)
                throw new ArgumentException(ErrorMessages.Vehicle.MissingYear);
            if (!AllowedYears.Contains(Year))
                throw new ArgumentException(ErrorMessages.Vehicle.InvalidYearRange);
            if (string.IsNullOrWhiteSpace(LicensePlate))
                throw new ArgumentException(ErrorMessages.Vehicle.MissingLicensePlate);
            if (string.IsNullOrWhiteSpace(Color))
                throw new ArgumentException(ErrorMessages.Vehicle.MissingColor);
            if (Price <= 0)
                throw new ArgumentException(ErrorMessages.Vehicle.InvalidPrice);
            if (Photos != null && Photos.Count > MaxPhotos)
                throw new ArgumentException(ErrorMessages.Vehicle.MaxPhotosExceeded);
        }

        /// <summary>
        /// Atualiza as fotos do veículo (máximo 15)
        /// </summary>
        public void UpdatePhotos(IEnumerable<string> photoUrls)
        {
            Photos.Clear();
            if (photoUrls != null && photoUrls.Any())
            {
                foreach (var url in photoUrls.Take(MaxPhotos))
                    Photos.Add(new VehiclePhoto { Url = url, IdVehicle = Id });
            }
        }

        /// <summary>
        /// Atualiza os opcionais do veículo
        /// </summary>
        public void UpdateFeatures(IEnumerable<int> featureIds)
        {
            Features.Clear();
            if (featureIds != null && featureIds.Any())
            {
                foreach (var featureId in featureIds.Distinct())
                    Features.Add(new VehicleFeature { IdFeature = featureId, IdVehicle = Id});
            }
        }
    }
}