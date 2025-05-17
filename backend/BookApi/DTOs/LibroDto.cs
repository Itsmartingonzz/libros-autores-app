namespace BookApi.DTOs
{
    public class LibroDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public int Anio { get; set; }
        public string Genero { get; set; } = null!;
        public int NumeroPaginas { get; set; }
        public string AutorRut { get; set; } = null!;
    }
}
