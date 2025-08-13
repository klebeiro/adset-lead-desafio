using adset_api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace adset_api.Infrastructure.Data.Configurations
{
    public class VehiclePhotoMap : IEntityTypeConfiguration<VehiclePhoto>
    {
        public void Configure(EntityTypeBuilder<VehiclePhoto> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Url).IsRequired().HasMaxLength(2048);
            builder.Property(p => p.IdVehicle).IsRequired();

            builder.HasOne(p => p.Vehicle)
                .WithMany(v => v.Photos)
                .HasForeignKey(p => p.IdVehicle)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
