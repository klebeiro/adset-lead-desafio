using adset_api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace adset_api.Infrastructure.Data.Mappings
{
    public class VehicleFeatureMap : IEntityTypeConfiguration<VehicleFeature>
    {
        public void Configure(EntityTypeBuilder<VehicleFeature> builder)
        {
            builder.HasKey(f => f.Id);

            builder.Property(f => f.IdFeature).IsRequired();
            builder.Property(f => f.IdVehicle).IsRequired();

            builder.HasOne(f => f.Vehicle)
                .WithMany(v => v.Features)
                .HasForeignKey(f => f.IdVehicle)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
