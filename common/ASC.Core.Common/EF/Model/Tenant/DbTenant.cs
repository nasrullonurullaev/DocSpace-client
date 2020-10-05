﻿using System;
using System.ComponentModel.DataAnnotations.Schema;

using ASC.Core.Tenants;

using Microsoft.EntityFrameworkCore;

namespace ASC.Core.Common.EF.Model
{
    [Table("tenants_tenants")]
    public class DbTenant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Alias { get; set; }
        public string MappedDomain { get; set; }
        public int Version { get; set; }
        public DateTime? Version_Changed { get; set; }

        [NotMapped]
        public DateTime VersionChanged { get => Version_Changed ?? DateTime.MinValue; set => Version_Changed = value; }

        public string Language { get; set; }
        public string TimeZone { get; set; }
        public string TrustedDomains { get; set; }
        public TenantTrustedDomainsType TrustedDomainsEnabled { get; set; }
        public TenantStatus Status { get; set; }

        public DateTime? StatusChanged { get; set; }

        //hack for DateTime?
        [NotMapped]
        public DateTime? StatusChangedHack { get { return StatusChanged; } set { StatusChanged = value; } }

        public DateTime CreationDateTime { get; set; }

        [Column("owner_id")]
        public Guid OwnerId { get; set; }
        public bool Public { get; set; }
        public string PublicVisibleProducts { get; set; }

        [Column("payment_id")]
        public string PaymentId { get; set; }
        public TenantIndustry? Industry { get; set; }

        [Column("last_modified")]
        public DateTime LastModified { get; set; }
        public bool Spam { get; set; }
        public bool Calls { get; set; }

        public DbTenantPartner Partner { get; set; }
    }

    public static class DbTenantExtension
    {
        public static ModelBuilderWrapper AddDbTenant(this ModelBuilderWrapper modelBuilder)
        {
            modelBuilder
                .Add(MySqlAddDbTenant, Provider.MySql)
                .Add(PgSqlAddDbTenant, Provider.Postrge)
                .HasData(
                new DbTenant
                {
                    Id = 1,
                    Alias = "localhost",
                    Name = "Web Office",
                    CreationDateTime = DateTime.UtcNow,
                    OwnerId = Guid.Parse("66faa6e4-f133-11ea-b126-00ffeec8b4ef")
                }
                );
            return modelBuilder;
        }

        public static void MySqlAddDbTenant(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DbTenant>()
                .HasOne(r => r.Partner)
                .WithOne(r => r.Tenant)
                .HasPrincipalKey<DbTenant>(r => new { r.Id });

            modelBuilder.Entity<DbTenant>(entity =>
            {
                entity.ToTable("tenants_tenants", "onlyoffice");

                entity.HasIndex(e => e.LastModified)
                    .HasName("last_modified");

                entity.HasIndex(e => e.MappedDomain)
                    .HasName("mappeddomain");

                entity.HasIndex(e => e.Version)
                    .HasName("version");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Alias)
                    .IsRequired()
                    .HasColumnName("alias")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Calls)
                    .HasColumnName("calls")
                    .HasDefaultValueSql("true");

                entity.Property(e => e.CreationDateTime)
                    .HasColumnName("creationdatetime")
                    .HasColumnType("datetime");

                entity.Property(e => e.Industry).HasColumnName("industry");

                entity.Property(e => e.Language)
                    .IsRequired()
                    .HasColumnName("language")
                    .HasColumnType("char(10)")
                    .HasDefaultValueSql("'en-US'")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.LastModified)
                    .HasColumnName("last_modified")
                    .HasColumnType("timestamp")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.MappedDomain)
                    .HasColumnName("mappeddomain")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.OwnerId)
                    .HasColumnName("owner_id")
                    .HasColumnType("varchar(38)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PaymentId)
                    .HasColumnName("payment_id")
                    .HasColumnType("varchar(38)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Public).HasColumnName("public");

                entity.Property(e => e.PublicVisibleProducts)
                    .HasColumnName("publicvisibleproducts")
                    .HasColumnType("varchar(1024)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Spam)
                    .HasColumnName("spam")
                    .HasDefaultValueSql("true");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.StatusChanged)
                    .HasColumnName("statuschanged")
                    .HasColumnType("datetime");

                entity.Property(e => e.TimeZone)
                    .HasColumnName("timezone")
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.TrustedDomains)
                    .HasColumnName("trusteddomains")
                    .HasColumnType("varchar(1024)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.TrustedDomainsEnabled)
                    .HasColumnName("trusteddomainsenabled")
                    .HasDefaultValueSql("'1'");

                entity.Property(e => e.Version)
                    .HasColumnName("version")
                    .HasDefaultValueSql("'2'");

                entity.Property(e => e.VersionChanged)
                    .HasColumnName("version_changed")
                    .HasColumnType("datetime");
            });
        }
        public static void PgSqlAddDbTenant(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DbTenant>(entity =>
            {
                entity.ToTable("tenants_tenants", "onlyoffice");

                entity.HasIndex(e => e.Alias)
                    .HasName("alias")
                    .IsUnique();

                entity.HasIndex(e => e.LastModified)
                    .HasName("last_modified_tenants_tenants");

                entity.HasIndex(e => e.MappedDomain)
                    .HasName("mappeddomain");

                entity.HasIndex(e => e.Version)
                    .HasName("version");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Alias)
                    .IsRequired()
                    .HasColumnName("alias")
                    .HasMaxLength(100);

                entity.Property(e => e.Calls)
                    .HasColumnName("calls")
                    .HasDefaultValueSql("true");

                entity.Property(e => e.CreationDateTime).HasColumnName("creationdatetime");

                entity.Property(e => e.Industry).HasColumnName("industry");

                entity.Property(e => e.Language)
                    .IsRequired()
                    .HasColumnName("language")
                    .HasMaxLength(10)
                    .IsFixedLength()
                    .HasDefaultValueSql("'en-US'");

                entity.Property(e => e.LastModified)
                    .HasColumnName("last_modified")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.MappedDomain)
                    .HasColumnName("mappeddomain")
                    .HasMaxLength(100)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(255);

                entity.Property(e => e.OwnerId)
                    .HasColumnName("owner_id")
                    .HasMaxLength(38)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.PaymentId)
                    .HasColumnName("payment_id")
                    .HasMaxLength(38)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.Public).HasColumnName("public");

                entity.Property(e => e.PublicVisibleProducts)
                    .HasColumnName("publicvisibleproducts")
                    .HasMaxLength(1024)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.Spam)
                    .HasColumnName("spam")
                    .HasDefaultValueSql("true");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.StatusChanged).HasColumnName("statuschanged");

                entity.Property(e => e.TimeZone)
                    .HasColumnName("timezone")
                    .HasMaxLength(50)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.TrustedDomains)
                    .HasColumnName("trusteddomains")
                    .HasMaxLength(1024)
                    .HasDefaultValueSql("NULL");

                entity.Property(e => e.TrustedDomainsEnabled)
                    .HasColumnName("trusteddomainsenabled")
                    .HasDefaultValueSql("1");

                entity.Property(e => e.Version)
                    .HasColumnName("version")
                    .HasDefaultValueSql("2");

                entity.Property(e => e.VersionChanged).HasColumnName("version_changed");
            });
        }
    }
}
