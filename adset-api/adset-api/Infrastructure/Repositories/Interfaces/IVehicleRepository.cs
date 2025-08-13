using adset_api.Application.DTOs;
using adset_api.Application.Filters;
using adset_api.Domain.Entities;

namespace adset_api.Infra.Repositories.Interfaces
{
    public interface IVehicleRepository
    {
        Task<IEnumerable<Vehicle>> GetAsync(VehicleFilter? filter = null);
        Task<VehicleStatsDto> GetStatsAsync();
        Task<Vehicle?> GetByIdAsync(int id);
        Task<Vehicle> CreateAsync(Vehicle vehicle);
        Task<Vehicle> UpdateAsync(Vehicle vehicle);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<string>> GetDistinctColorsAsync();
    }
}