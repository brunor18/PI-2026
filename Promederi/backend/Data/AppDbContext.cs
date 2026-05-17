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



        public DbSet<Usuario> Usuarios { get; set; } // transforma a classe Usuario em uma tabela do banco de dados
        public DbSet<Medicamento> Medicamentos { get; set; } // transforma a classe Medicamentos em uma tabela do banco de dados

    }
}

