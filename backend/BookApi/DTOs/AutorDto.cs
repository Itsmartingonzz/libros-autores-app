using System;
using System.Collections.Generic;

namespace BookApi.DTOs
{
    public class AutorDto
    {
        public string Rut { get; set; } = null!;
        public string NombreCompleto { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public string Ciudad { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public List<LibroDto> Libros { get; set; } = new();
    }
}