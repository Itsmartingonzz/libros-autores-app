using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookApi.Entities
{
    public class Autor
    {
        [Key]
        [Required]
        public string Rut { get; set; } = null!;

        [Required]
        public string NombreCompleto { get; set; } = null!;

        [Required]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        public string Ciudad { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Correo { get; set; } = null!;

        // Relación con libros (uno a muchos)
        public ICollection<Libro> Libros { get; set; } = new List<Libro>();
    }
}