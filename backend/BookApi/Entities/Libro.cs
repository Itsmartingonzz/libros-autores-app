using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookApi.Entities
{
    public class Libro
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Titulo { get; set; } = null!;

        [Required]
        public int Anio { get; set; }

        [Required]
        public string Genero { get; set; } = null!;

        [Required]
        public int NumeroPaginas { get; set; }

        [Required]
        [ForeignKey("Autor")]
        public string AutorRut { get; set; } = null!;

        // Navegación inversa
        public Autor? Autor { get; set; }
    }
}