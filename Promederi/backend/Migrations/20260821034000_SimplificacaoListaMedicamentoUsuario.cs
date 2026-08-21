using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SimplificacaoListaMedicamentoUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId1",
                table: "Medicamentos");

            migrationBuilder.DropIndex(
                name: "IX_Medicamentos_UsuarioId1",
                table: "Medicamentos");

            migrationBuilder.DropColumn(
                name: "UsuarioId1",
                table: "Medicamentos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsuarioId1",
                table: "Medicamentos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Medicamentos_UsuarioId1",
                table: "Medicamentos",
                column: "UsuarioId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId1",
                table: "Medicamentos",
                column: "UsuarioId1",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }
    }
}
