using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ASC.Migrations.PostgreSql.Migrations.FilesDb
{
    /// <inheritdoc />
    public partial class FilesDbContextUpgrade2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "tenant_id_modified_on",
                schema: "onlyoffice",
                table: "files_folder",
                columns: new[] { "tenant_id", "modified_on" });

            migrationBuilder.CreateIndex(
                name: "tenant_id_title",
                schema: "onlyoffice",
                table: "files_folder",
                columns: new[] { "tenant_id", "title" });

            migrationBuilder.CreateIndex(
                name: "tenant_id_content_length",
                schema: "onlyoffice",
                table: "files_file",
                columns: new[] { "tenant_id", "content_length" });

            migrationBuilder.CreateIndex(
                name: "tenant_id_modified_on",
                schema: "onlyoffice",
                table: "files_file",
                columns: new[] { "tenant_id", "modified_on" });

            migrationBuilder.CreateIndex(
                name: "tenant_id_title",
                schema: "onlyoffice",
                table: "files_file",
                columns: new[] { "tenant_id", "title" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "tenant_id_modified_on",
                schema: "onlyoffice",
                table: "files_folder");

            migrationBuilder.DropIndex(
                name: "tenant_id_title",
                schema: "onlyoffice",
                table: "files_folder");

            migrationBuilder.DropIndex(
                name: "tenant_id_content_length",
                schema: "onlyoffice",
                table: "files_file");

            migrationBuilder.DropIndex(
                name: "tenant_id_modified_on",
                schema: "onlyoffice",
                table: "files_file");

            migrationBuilder.DropIndex(
                name: "tenant_id_title",
                schema: "onlyoffice",
                table: "files_file");
        }
    }
}
