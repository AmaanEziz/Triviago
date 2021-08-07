using Microsoft.EntityFrameworkCore.Migrations;

namespace Triviago.Migrations
{
    public partial class noIP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IPAddress",
                table: "UserSessions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IPAddress",
                table: "UserSessions",
                type: "nvarchar(45)",
                nullable: true);
        }
    }
}
