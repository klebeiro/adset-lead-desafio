using System.Text.Json.Serialization;
using adset_api.Domain.Enums;

namespace adset_api.Application.DTOs
{
    public class SetPackageDto
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EICarrosPackageTier? ICarrosPackageTier { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EWebmotorsPackageTier? WebmotorsPackageTier { get; set; }
    }
}
