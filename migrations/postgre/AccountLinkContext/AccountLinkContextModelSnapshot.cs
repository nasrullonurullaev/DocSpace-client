// <auto-generated />
using System;
using ASC.Core.Common.EF.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ASC.Migrations.PostgreSql.Migrations
{
    [DbContext(typeof(AccountLinkContext))]
    partial class AccountLinkContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("ASC.Core.Common.EF.Model.AccountLinks", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasColumnName("id");

                    b.Property<string>("UId")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasColumnName("uid");

                    b.Property<DateTime>("Linked")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("linked");

                    b.Property<string>("Profile")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("profile");

                    b.Property<string>("Provider")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(60)
                        .HasColumnType("character(60)")
                        .HasColumnName("provider")
                        .HasDefaultValueSql("NULL")
                        .IsFixedLength();

                    b.HasKey("Id", "UId")
                        .HasName("account_links_pkey");

                    b.HasIndex("UId")
                        .HasDatabaseName("uid");

                    b.ToTable("account_links", "onlyoffice");
                });
#pragma warning restore 612, 618
        }
    }
}
