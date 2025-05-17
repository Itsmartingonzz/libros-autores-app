using BookApi.Data;
using BookApi.Entities;
using BookApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LibrosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LibrosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/libros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Libro>>> GetLibros()
        {
            return await _context.Libros.Include(l => l.Autor).ToListAsync();
        }

        // GET: api/libros/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Libro>> GetLibro(int id)
        {
            var libro = await _context.Libros.Include(l => l.Autor)
                                             .FirstOrDefaultAsync(l => l.Id == id);

            if (libro == null)
            {
                return NotFound();
            }

            return libro;
        }

        // POST: api/libros
        [HttpPost]
        public async Task<ActionResult<Libro>> CreateLibro(Libro libro)
        {
            var autor = await _context.Autores.FindAsync(libro.AutorRut);
            if (autor == null)
            {
                return BadRequest(new { message = "El autor no está registrado." });
            }

            // Validar que no supere el límite de 10 libros
            int cantidadLibros = await _context.Libros.CountAsync(l => l.AutorRut == libro.AutorRut);
            if (cantidadLibros >= 10)
            {
                return BadRequest(new { message = "No es posible registrar el libro, se alcanzó el máximo permitido." });
            }

            _context.Libros.Add(libro);
            await _context.SaveChangesAsync();

            var dto = new LibroDto
            {
                Id = libro.Id,
                Titulo = libro.Titulo,
                Anio = libro.Anio,
                Genero = libro.Genero,
                NumeroPaginas = libro.NumeroPaginas,
                AutorRut = libro.AutorRut
            };

            return CreatedAtAction(nameof(GetLibro), new { id = libro.Id }, dto);
        }

        // PUT: api/libros/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLibro(int id, Libro libro)
        {
            if (id != libro.Id)
            {
                return BadRequest(new { message = "El ID de la URL no coincide con el del cuerpo." });
            }

            var existe = await _context.Libros.AnyAsync(l => l.Id == id);
            if (!existe)
            {
                return NotFound();
            }

            _context.Entry(libro).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/libros/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLibro(int id)
        {
            var libro = await _context.Libros.FindAsync(id);
            if (libro == null)
            {
                return NotFound();
            }

            _context.Libros.Remove(libro);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
