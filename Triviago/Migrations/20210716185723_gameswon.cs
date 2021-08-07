using Microsoft.EntityFrameworkCore.Migrations;

namespace Triviago.Migrations
{
    public partial class gameswon : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "gamesWon",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "gamesWon",
                table: "Users");
        }
    }
}
