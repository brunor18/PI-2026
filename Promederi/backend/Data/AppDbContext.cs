using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext // transforma a classe em um contexto de banco de dados
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) // construtor que recebe as opções de configuração do banco de dados
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CampoClinico>(entity =>
            {
                entity.Property(c => c.Nome).HasMaxLength(100).IsRequired();
                entity.Property(c => c.Descricao).HasMaxLength(500);
                entity.Property(c => c.Valor).HasMaxLength(5000);
                entity.HasOne(c => c.Usuario)
                    .WithMany()
                    .HasForeignKey(c => c.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Medicamento>()  
                .HasOne(m => m.Usuario)
                .WithMany(u => u.Medicamentos)
                .HasForeignKey(m => m.UsuarioId)  // um usuario pode possuir varios medicamentos, mas cada medicamento pertence a apenas um usuario
                .OnDelete(DeleteBehavior.Cascade);
        }



        public DbSet<Usuario> usuarios { get; set; } // transforma a classe Usuario em uma tabela do banco de dados
        public DbSet<CampoClinico> camposClinicos { get; set; }
        public DbSet<Medicamento> medicamentos { get; set; } // transforma a classe Medicamentos em uma tabela do banco de dados

    }
}

