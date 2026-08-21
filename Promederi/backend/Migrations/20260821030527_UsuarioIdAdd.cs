using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UsuarioIdAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId",
                table: "Medicamentos");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioId",
                table: "Medicamentos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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
                name: "FK_Medicamentos_Usuarios_UsuarioId",
                table: "Medicamentos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId1",
                table: "Medicamentos",
                column: "UsuarioId1",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId",
                table: "Medicamentos");

            migrationBuilder.DropForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId1",
                table: "Medicamentos");

            migrationBuilder.DropIndex(
                name: "IX_Medicamentos_UsuarioId1",
                table: "Medicamentos");

            migrationBuilder.DropColumn(
                name: "UsuarioId1",
                table: "Medicamentos");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioId",
                table: "Medicamentos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Medicamentos_Usuarios_UsuarioId",
                table: "Medicamentos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }
    }
}
