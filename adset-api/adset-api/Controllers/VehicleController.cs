using adset_api.Application.DTOs;
using adset_api.Application.Errors;
using adset_api.Application.Filters;
using adset_api.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace adset_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        // GET: api/vehicle
        [HttpGet]
        public async Task<IActionResult> GetAsync([FromQuery] VehicleFilter filter)  
        {
            var vehicles = await _vehicleService.GetVehiclesAsync(filter);
            return Ok(vehicles);
        }

        // GET: api/vehicle/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync([FromRoute] int id)
        {
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }

        // GET: api/vehicle/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStatsAsync()
        {
            var stats = await _vehicleService.GetVehicleStatsAsync();
            return Ok(stats);
        }

        // POST: api/vehicle
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] VehicleCreateDto dto)
        {
            if (dto == null) return BadRequest(ErrorMessages.Common.InvalidPayload);

            var created = await _vehicleService.CreateVehicleAsync(dto);
            return Created($"/api/vehicle/{created.Id}", created);
        }

        // PUT: api/vehicle/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] VehicleUpdateDto dto)
        {
            if (dto == null) return BadRequest(ErrorMessages.Common.InvalidPayload);

            var updated = await _vehicleService.UpdateVehicleAsync(id, dto);
            return Ok(updated);
        }

        // PUT: api/vehicle/{id}/package
        [HttpPut("{id:int}/package")]
        public async Task<IActionResult> SetPackageAsync([FromRoute] int id, [FromBody] SetPackageDto dto)
        {
            if (dto == null) return BadRequest(ErrorMessages.Common.InvalidPayload);

            var updated = await _vehicleService.SetVehiclePackageAsync(id, dto);
            return Ok(updated);
        }

        // DELETE: api/vehicle/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var deleted = await _vehicleService.DeleteVehicleAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET: api/vehicle/colors
        [HttpGet("colors")]
        public async Task<IActionResult> GetColorsAsync()
        {
            var colors = await _vehicleService.GetDistinctColorsAsync();
            return Ok(colors);
        }
    }
}