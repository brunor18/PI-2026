using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTipoUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdosoId",
                table: "usuarios",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TipoUsuario",
                table: "usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_IdosoId",
                table: "usuarios",
                column: "IdosoId");

            migrationBuilder.AddForeignKey(
                name: "FK_usuarios_usuarios_IdosoId",
                table: "usuarios",
                column: "IdosoId",
                principalTable: "usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_usuarios_usuarios_IdosoId",
                table: "usuarios");

            migrationBuilder.DropIndex(
                name: "IX_usuarios_IdosoId",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "IdosoId",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "TipoUsuario",
                table: "usuarios");
        }
    }
}
