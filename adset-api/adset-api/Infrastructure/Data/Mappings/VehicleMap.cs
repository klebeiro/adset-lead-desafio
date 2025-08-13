using adset_api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace adset_api.Infrastructure.Data.Mappings
{
    public class VehicleMap : IEntityTypeConfiguration<Vehicle>
    {
        public void Configure(EntityTypeBuilder<Vehicle> builder)
        {
            builder.HasKey(v => v.Id);

            builder.Property(v => v.Brand)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(v => v.Model)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(v => v.Year)
                .IsRequired();

            builder.Property(v => v.LicensePlate)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(v => v.Color)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(v => v.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(v => v.CreatedAt)
                .IsRequired();

            builder.Property(v => v.Mileage);

            builder.Property(v => v.IdICarrosPackageTier)
                .HasConversion<int>();

            builder.Property(v => v.IdWebmotorsPackageTier)
                .HasConversion<int>();

            builder.HasMany(v => v.Photos)
                .WithOne(p => p.Vehicle)
                .HasForeignKey(p => p.IdVehicle)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(v => v.Features)
                .WithOne(f => f.Vehicle)
                .HasForeignKey(f => f.IdVehicle)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
