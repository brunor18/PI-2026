using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations;

public partial class AdicionarAnotacoesEPerfilCuidador : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Funcao",
            table: "Cuidadores",
            type: "varchar(200)",
            maxLength: 200,
            nullable: false,
            defaultValue: "")
            .Annotation("MySql:CharSet", "utf8mb4");
        migrationBuilder.AddColumn<string>(
            name: "Experiencia",
            table: "Cuidadores",
            type: "varchar(200)",
            maxLength: 200,
            nullable: false,
            defaultValue: "")
            .Annotation("MySql:CharSet", "utf8mb4");
        migrationBuilder.AddColumn<string>(
            name: "AreaAtendimento",
            table: "Cuidadores",
            type: "varchar(300)",
            maxLength: 300,
            nullable: false,
            defaultValue: "")
            .Annotation("MySql:CharSet", "utf8mb4");
        migrationBuilder.AddColumn<string>(
            name: "Especialidades",
            table: "Cuidadores",
            type: "varchar(1000)",
            maxLength: 1000,
            nullable: false,
            defaultValue: "")
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "Anotacoes",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                UsuarioId = table.Column<int>(type: "int", nullable: false),
                AutorUsuarioId = table.Column<int>(type: "int", nullable: false),
                Texto = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Anotacoes", x => x.Id);
                table.ForeignKey("FK_Anotacoes_usuarios_AutorUsuarioId", x => x.AutorUsuarioId, "usuarios", "Id", onDelete: ReferentialAction.Restrict);
                table.ForeignKey("FK_Anotacoes_usuarios_UsuarioId", x => x.UsuarioId, "usuarios", "Id", onDelete: ReferentialAction.Cascade);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex("IX_Anotacoes_AutorUsuarioId", "Anotacoes", "AutorUsuarioId");
        migrationBuilder.CreateIndex("IX_Anotacoes_UsuarioId_CreatedAt", "Anotacoes", new[] { "UsuarioId", "CreatedAt" });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable("Anotacoes");
        migrationBuilder.DropColumn("Funcao", "Cuidadores");
        migrationBuilder.DropColumn("Experiencia", "Cuidadores");
        migrationBuilder.DropColumn("AreaAtendimento", "Cuidadores");
        migrationBuilder.DropColumn("Especialidades", "Cuidadores");
    }
}
