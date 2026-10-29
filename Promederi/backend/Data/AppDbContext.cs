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

            modelBuilder.Entity<Cuidadores>(entity =>
            {
                entity.ToTable("Cuidadores");
                entity.Property(c => c.Nome).HasMaxLength(200).IsRequired();
                entity.Property(c => c.Numero).HasMaxLength(20).IsRequired();
                entity.Property(c => c.Endereco).HasMaxLength(500).IsRequired();
                entity.Property(c => c.Descricao).HasMaxLength(2000).IsRequired();
                entity.HasOne(c => c.Usuario).WithOne(u => u.PerfilCuidador)
                    .HasForeignKey<Cuidadores>(c => c.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(c => c.Idosos).WithMany(u => u.CuidadoresAtendentes)
                    .UsingEntity<Dictionary<string, object>>(
                        "CuidadoresIdosos",
                        j => j.HasOne<Usuario>().WithMany().HasForeignKey("IdosoId").OnDelete(DeleteBehavior.Cascade),
                        j => j.HasOne<Cuidadores>().WithMany().HasForeignKey("CuidadorId").OnDelete(DeleteBehavior.Cascade),
                        j => j.HasKey("CuidadorId", "IdosoId"));
            });

            modelBuilder.Entity<ProcedimentoCirurgico>(entity =>
            {
                entity.HasKey(procedimento => procedimento.id);
                entity.Property(procedimento => procedimento.data).HasColumnType("date").IsRequired();
                entity.Property(procedimento => procedimento.tipoProcedimento).HasMaxLength(200).IsRequired();
                entity.Property(procedimento => procedimento.observacoesMedicas).HasMaxLength(5000);
                entity.HasOne(procedimento => procedimento.usuario)
                    .WithMany()
                    .HasForeignKey(procedimento => procedimento.usuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

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

            modelBuilder.Entity<Usuario>()
            .HasOne(u => u.Idoso)
            .WithMany(u => u.Cuidadores)
            .HasForeignKey(u => u.IdosoId)
            .OnDelete(DeleteBehavior.Restrict);
        }



        public DbSet<Usuario> usuarios { get; set; } // transforma a classe Usuario em uma tabela do banco de dados
        public DbSet<Cuidadores> cuidadores { get; set; }
        public DbSet<CampoClinico> camposClinicos { get; set; }
        public DbSet<ProcedimentoCirurgico> procedimentosCirurgicos { get; set; }
        public DbSet<Medicamento> medicamentos { get; set; } // transforma a classe Medicamentos em uma tabela do banco de dados

    }
}

