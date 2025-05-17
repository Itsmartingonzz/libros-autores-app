using Microsoft.EntityFrameworkCore;
using BookApi.Entities;

namespace BookApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Autor> Autores { get; set; } = null!;
        public DbSet<Libro> Libros { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Autor>()
                .HasMany(a => a.Libros)
                .WithOne(l => l.Autor)
                .HasForeignKey(l => l.AutorRut)
                .HasPrincipalKey(a => a.Rut)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Libro>()
                .HasKey(l => l.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}
