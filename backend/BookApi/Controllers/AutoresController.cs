using BookApi.Data;
using BookApi.Entities;
using BookApi.DTOs;
using BookApi.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AutoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/autores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Autor>>> GetAutores()
        {
            var autores = await _context.Autores
                .Include(a => a.Libros)
                .OrderBy(a => a.NombreCompleto)
                .ToListAsync();

            var dtos = autores.Select(a => new AutorDto
            {
                Rut = a.Rut,
                NombreCompleto = a.NombreCompleto,
                FechaNacimiento = a.FechaNacimiento,
                Ciudad = a.Ciudad,
                Correo = a.Correo,
                Libros = a.Libros.Select(l => new LibroDto
                {
                    Id = l.Id,
                    Titulo = l.Titulo,
                    Anio = l.Anio,
                    Genero = l.Genero,
                    NumeroPaginas = l.NumeroPaginas,
                    AutorRut = l.AutorRut
                }).ToList()
            });

            return Ok(dtos);
        }

        // GET: api/autores/12345678-9
        [HttpGet("{rut}")]
        public async Task<ActionResult<Autor>> GetAutor(string rut)
        {
            var autor = await _context.Autores.FindAsync(rut);

            if (autor == null)
            {
                return NotFound();
            }

            return autor;
        }

        // POST: api/autores
        [HttpPost]
        public async Task<ActionResult<Autor>> CreateAutor(Autor autor)
        {

            autor.Rut = autor.Rut.Replace(".", "").Replace("-", "").ToUpper();

            // Validar que el RUT sea válido
            if (!RutValidator.EsRutValido(autor.Rut))
            {
                return BadRequest(new { message = "El RUT no es válido." });
            }


            // Validar si ya existe
            var existe = await _context.Autores.AnyAsync(a => a.Rut == autor.Rut);
            if (existe)
            {
                return Conflict(new { message = "Ya existe un autor con ese RUT." });
            }

            _context.Autores.Add(autor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAutor), new { rut = autor.Rut }, autor);
        }

        // PUT: api/autores/12345678-9
        [HttpPut("{rut}")]
        public async Task<IActionResult> UpdateAutor(string rut, Autor autor)
        {
            if (rut != autor.Rut)
            {
                return BadRequest(new { message = "El RUT de la URL no coincide con el del cuerpo." });
            }

            var existe = await _context.Autores.AnyAsync(a => a.Rut == rut);
            if (!existe)
            {
                return NotFound();
            }

            _context.Entry(autor).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/autores/12345678-9
        [HttpDelete("{rut}")]
        public async Task<IActionResult> DeleteAutor(string rut)
        {
            var autor = await _context.Autores.FindAsync(rut);
            if (autor == null)
            {
                return NotFound();
            }

            _context.Autores.Remove(autor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}