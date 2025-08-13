using adset_api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace adset_api.Infra.Data
{
    public class AdsetDbContext : DbContext
    {
        public AdsetDbContext(DbContextOptions<AdsetDbContext> options)
            : base(options)
        {
        }

        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehiclePhoto> VehiclePhotos { get; set; }
        public DbSet<VehicleFeature> VehicleFeatures { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AdsetDbContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }
    }
}