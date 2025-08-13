namespace adset_api.Domain.Entities
{
    public class VehiclePhoto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public int IdVehicle { get; set; }

        public virtual Vehicle Vehicle { get; set; }
    }
}
