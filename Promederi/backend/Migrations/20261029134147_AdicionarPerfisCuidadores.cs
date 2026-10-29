using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarPerfisCuidadores : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cuidadores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Nome = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Idade = table.Column<int>(type: "int", nullable: true),
                    Endereco = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Descricao = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cuidadores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cuidadores_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CuidadoresIdosos",
                columns: table => new
                {
                    CuidadorId = table.Column<int>(type: "int", nullable: false),
                    IdosoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CuidadoresIdosos", x => new { x.CuidadorId, x.IdosoId });
                    table.ForeignKey(
                        name: "FK_CuidadoresIdosos_Cuidadores_CuidadorId",
                        column: x => x.CuidadorId,
                        principalTable: "Cuidadores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CuidadoresIdosos_usuarios_IdosoId",
                        column: x => x.IdosoId,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Cuidadores_UsuarioId",
                table: "Cuidadores",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CuidadoresIdosos_IdosoId",
                table: "CuidadoresIdosos",
                column: "IdosoId");

            // Cria perfis para contas de cuidador anteriores a esta migração.
            migrationBuilder.Sql(@"
                INSERT INTO `Cuidadores` (`UsuarioId`, `Nome`, `Idade`, `Endereco`, `Descricao`)
                SELECT `Id`, LEFT(`nome`, 200), NULL, '', ''
                FROM `usuarios`
                WHERE `TipoUsuario` = 2;");

            // Preserva o vínculo legado sem limitar o cuidador a um único idoso.
            migrationBuilder.Sql(@"
                INSERT INTO `CuidadoresIdosos` (`CuidadorId`, `IdosoId`)
                SELECT c.`Id`, u.`IdosoId`
                FROM `Cuidadores` c
                INNER JOIN `usuarios` u ON u.`Id` = c.`UsuarioId`
                INNER JOIN `usuarios` i ON i.`Id` = u.`IdosoId`
                WHERE i.`TipoUsuario` = 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CuidadoresIdosos");

            migrationBuilder.DropTable(
                name: "Cuidadores");
        }
    }
}
