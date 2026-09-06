using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class refatoracaoNomeDasTabelas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId",
                table: "Medicamentos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Medicamentos",
                table: "Medicamentos");

            migrationBuilder.RenameTable(
                name: "Usuarios",
                newName: "usuarios");

            migrationBuilder.RenameTable(
                name: "Medicamentos",
                newName: "medicamentos");

            migrationBuilder.RenameIndex(
                name: "IX_Medicamentos_UsuarioId",
                table: "medicamentos",
                newName: "IX_medicamentos_UsuarioId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_usuarios",
                table: "usuarios",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_medicamentos",
                table: "medicamentos",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_medicamentos_usuarios_UsuarioId",
                table: "medicamentos",
                column: "UsuarioId",
                principalTable: "usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_medicamentos_usuarios_UsuarioId",
                table: "medicamentos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_usuarios",
                table: "usuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_medicamentos",
                table: "medicamentos");

            migrationBuilder.RenameTable(
                name: "usuarios",
                newName: "Usuarios");

            migrationBuilder.RenameTable(
                name: "medicamentos",
                newName: "Medicamentos");

            migrationBuilder.RenameIndex(
                name: "IX_medicamentos_UsuarioId",
                table: "Medicamentos",
                newName: "IX_Medicamentos_UsuarioId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Medicamentos",
                table: "Medicamentos",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId",
                table: "Medicamentos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
