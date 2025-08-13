using adset_api.Application.DTOs;
using adset_api.Application.Errors;
using adset_api.Application.Filters;
using adset_api.Domain.Entities;
using adset_api.Infra.Data;
using adset_api.Infra.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace adset_api.Infra.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly AdsetDbContext _context;

        public VehicleRepository(AdsetDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vehicle>> GetAsync(VehicleFilter? filter = null)
        {
            const int MinYear = 2000;
            const int MaxYear = 2024;

            IQueryable<Vehicle> query = _context.Vehicles
                .AsNoTracking()
                .AsSplitQuery()
                .Include(v => v.Photos)
                .Include(v => v.Features);

            if (filter != null)
            {
                if (filter.YearMin.HasValue)
                {
                    var yearMin = Math.Max(MinYear, filter.YearMin.Value);
                    query = query.Where(v => v.Year >= yearMin);
                }

                if (filter.YearMax.HasValue)
                {
                    var yearMax = Math.Min(MaxYear, filter.YearMax.Value);
                    query = query.Where(v => v.Year <= yearMax);
                }

                if (!string.IsNullOrWhiteSpace(filter.PriceRange))
                {
                    switch (filter.PriceRange.Trim())
                    {
                        case "10-50":
                            query = query.Where(v => v.Price >= 10_000m && v.Price <= 50_000m);
                            break;
                        case "50-90":
                            query = query.Where(v => v.Price > 50_000m && v.Price <= 90_000m);
                            break;
                        case "90plus":
                            query = query.Where(v => v.Price > 90_000m);
                            break;
                        default:
                            throw new ArgumentException(ErrorMessages.Filter.InvalidPriceRange);
                    }
                }

                if (filter.WithPhotos.HasValue)
                {
                    query = filter.WithPhotos.Value
                        ? query.Where(v => v.Photos.Any())
                        : query.Where(v => !v.Photos.Any());
                }

                if (!string.IsNullOrWhiteSpace(filter.Color))
                {
                    var color = filter.Color.Trim();
                    query = query.Where(v => v.Color == color);
                }

                if (!string.IsNullOrWhiteSpace(filter.LicensePlate))
                {
                    var licensePlate = filter.LicensePlate.Trim();
                    query = query.Where(v => v.LicensePlate.Contains(licensePlate));
                }

                if (!string.IsNullOrWhiteSpace(filter.Brand))
                {
                    var brand = filter.Brand.Trim();
                    query = query.Where(v => v.Brand.Contains(brand));
                }

                if (!string.IsNullOrWhiteSpace(filter.Model))
                {
                    var model = filter.Model.Trim();
                    query = query.Where(v => v.Model.Contains(model));
                }

                if (!string.IsNullOrWhiteSpace(filter.Feature))
                {
                    var feature = filter.Feature.Trim();
                    query = query.Where(v => v.Features.Any(f =>
                        _context.VehicleFeatures.Any(feat => feat.Id == f.IdFeature)));
                }
            }

            return await query
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();
        }

        public async Task<VehicleStatsDto> GetStatsAsync()
        {
            var total = await _context.Vehicles
            .AsNoTracking()
            .CountAsync();

            var comFotos = await _context.Vehicles
                .AsNoTracking()
                .Where(v => v.Photos.Any())
                .CountAsync();

            var semFotos = total - comFotos;

            return new VehicleStatsDto
            {
                Total = total,
                ComFotos = comFotos,
                SemFotos = semFotos
            };
        }

        public async Task<Vehicle?> GetByIdAsync(int id)
        {
            return await _context.Vehicles
                .Include(v => v.Photos.OrderBy(p => p.Id))
                .Include(v => v.Features)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vehicle> CreateAsync(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return vehicle;
        }

        public async Task<Vehicle> UpdateAsync(Vehicle vehicle)
        {
            _context.Entry(vehicle).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return vehicle;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return false;

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<string>> GetDistinctColorsAsync()
        {
            return await _context.Vehicles
                .AsNoTracking()
                .Where(v => !string.IsNullOrWhiteSpace(v.Color))
                .Select(v => v.Color)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }
    }
}