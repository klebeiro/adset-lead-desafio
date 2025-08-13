namespace adset_api.Domain.Entities
{
    public class VehicleFeature
    {
        public int Id { get; set; }
        public int IdFeature { get; set; }
        public int IdVehicle { get; set; }

        public virtual Vehicle Vehicle { get; set; }
    }
}
