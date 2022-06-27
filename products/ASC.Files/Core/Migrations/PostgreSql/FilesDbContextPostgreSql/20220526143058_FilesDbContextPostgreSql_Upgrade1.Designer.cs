// <auto-generated />
using System;
using ASC.Files.Core.EF;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ASC.Files.Core.Migrations.PostgreSql.FilesDbContextPostgreSql
{
    [DbContext(typeof(PostgreSqlFilesDbContext))]
    [Migration("20220526143058_FilesDbContextPostgreSql_Upgrade1")]
    partial class FilesDbContextPostgreSql_Upgrade1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("ASC.Core.Common.EF.DbQuota", b =>
                {
                    b.Property<int>("Tenant")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("tenant");

                    b.Property<int>("ActiveUsers")
                        .HasColumnType("int")
                        .HasColumnName("active_users");

                    b.Property<string>("AvangateId")
                        .HasColumnType("varchar(128)")
                        .HasColumnName("avangate_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Description")
                        .HasColumnType("varchar(128)")
                        .HasColumnName("description")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Features")
                        .HasColumnType("text")
                        .HasColumnName("features")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<long>("MaxFileSize")
                        .HasColumnType("bigint")
                        .HasColumnName("max_file_size");

                    b.Property<long>("MaxTotalSize")
                        .HasColumnType("bigint")
                        .HasColumnName("max_total_size");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(128)")
                        .HasColumnName("name")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(10,2)")
                        .HasColumnName("price");

                    b.Property<bool>("Visible")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("visible");

                    b.HasKey("Tenant")
                        .HasName("PRIMARY");

                    b.ToTable("tenants_quota", (string)null);

                    b.HasData(
                        new
                        {
                            Tenant = -1,
                            ActiveUsers = 10000,
                            AvangateId = "0",
                            Features = "domain,audit,controlpanel,healthcheck,ldap,sso,whitelabel,branding,ssbranding,update,support,portals:10000,discencryption,privacyroom,restore",
                            MaxFileSize = 102400L,
                            MaxTotalSize = 10995116277760L,
                            Name = "default",
                            Price = 0.00m,
                            Visible = false
                        });
                });

            modelBuilder.Entity("ASC.Core.Common.EF.DbTariff", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<string>("Comment")
                        .HasColumnType("varchar(255)")
                        .HasColumnName("comment")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime>("CreateOn")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("timestamp")
                        .HasColumnName("create_on")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<int>("Quantity")
                        .HasColumnType("int")
                        .HasColumnName("quantity");

                    b.Property<DateTime>("Stamp")
                        .HasColumnType("datetime")
                        .HasColumnName("stamp");

                    b.Property<int>("Tariff")
                        .HasColumnType("int")
                        .HasColumnName("tariff");

                    b.Property<int>("Tenant")
                        .HasColumnType("int")
                        .HasColumnName("tenant");

                    b.HasKey("Id");

                    b.HasIndex("Tenant")
                        .HasDatabaseName("tenant");

                    b.ToTable("tenants_tariff", (string)null);
                });

            modelBuilder.Entity("ASC.Core.Common.EF.Model.DbTenant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<string>("Alias")
                        .IsRequired()
                        .HasColumnType("varchar(100)")
                        .HasColumnName("alias")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<bool>("Calls")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("calls")
                        .HasDefaultValueSql("true");

                    b.Property<DateTime>("CreationDateTime")
                        .HasColumnType("datetime")
                        .HasColumnName("creationdatetime");

                    b.Property<int?>("Industry")
                        .HasColumnType("int")
                        .HasColumnName("industry");

                    b.Property<string>("Language")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(10)")
                        .HasColumnName("language")
                        .HasDefaultValueSql("'en-US'")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime>("LastModified")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp")
                        .HasColumnName("last_modified")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<string>("MappedDomain")
                        .HasColumnType("varchar(100)")
                        .HasColumnName("mappeddomain")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(255)")
                        .HasColumnName("name")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("OwnerId")
                        .IsRequired()
                        .HasColumnType("varchar(38)")
                        .HasColumnName("owner_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("PaymentId")
                        .HasColumnType("varchar(38)")
                        .HasColumnName("payment_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<bool>("Spam")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("spam")
                        .HasDefaultValueSql("true");

                    b.Property<int>("Status")
                        .HasColumnType("int")
                        .HasColumnName("status");

                    b.Property<DateTime?>("StatusChanged")
                        .HasColumnType("datetime")
                        .HasColumnName("statuschanged");

                    b.Property<string>("TimeZone")
                        .HasColumnType("varchar(50)")
                        .HasColumnName("timezone")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("TrustedDomainsEnabled")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("trusteddomainsenabled")
                        .HasDefaultValueSql("'1'");

                    b.Property<string>("TrustedDomainsRaw")
                        .HasColumnType("varchar(1024)")
                        .HasColumnName("trusteddomains")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("Version")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("version")
                        .HasDefaultValueSql("'2'");

                    b.Property<DateTime?>("Version_Changed")
                        .HasColumnType("datetime")
                        .HasColumnName("version_changed");

                    b.HasKey("Id");

                    b.HasIndex("LastModified")
                        .HasDatabaseName("last_modified");

                    b.HasIndex("MappedDomain")
                        .HasDatabaseName("mappeddomain");

                    b.HasIndex("Version")
                        .HasDatabaseName("version");

                    b.ToTable("tenants_tenants", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Alias = "localhost",
                            Calls = false,
                            CreationDateTime = new DateTime(2021, 3, 9, 17, 46, 59, 97, DateTimeKind.Utc).AddTicks(4317),
                            LastModified = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Name = "Web Office",
                            OwnerId = "66faa6e4-f133-11ea-b126-00ffeec8b4ef",
                            Spam = false,
                            Status = 0,
                            TrustedDomainsEnabled = 0,
                            Version = 0
                        });
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFile", b =>
                {
                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<int>("Id")
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<int>("Version")
                        .HasColumnType("int")
                        .HasColumnName("version");

                    b.Property<int>("Category")
                        .HasColumnType("int")
                        .HasColumnName("category");

                    b.Property<string>("Changes")
                        .HasColumnType("mediumtext")
                        .HasColumnName("changes")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Comment")
                        .HasColumnType("varchar(255)")
                        .HasColumnName("comment")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<long>("ContentLength")
                        .HasColumnType("bigint")
                        .HasColumnName("content_length");

                    b.Property<string>("ConvertedType")
                        .HasColumnType("varchar(10)")
                        .HasColumnName("converted_type")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("CreateBy")
                        .IsRequired()
                        .HasColumnType("char(38)")
                        .HasColumnName("create_by")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime>("CreateOn")
                        .HasColumnType("datetime")
                        .HasColumnName("create_on");

                    b.Property<bool>("CurrentVersion")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("current_version");

                    b.Property<bool>("Encrypted")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("encrypted");

                    b.Property<int>("FileStatus")
                        .HasColumnType("int")
                        .HasColumnName("file_status");

                    b.Property<int>("Forcesave")
                        .HasColumnType("int")
                        .HasColumnName("forcesave");

                    b.Property<string>("ModifiedBy")
                        .IsRequired()
                        .HasColumnType("char(38)")
                        .HasColumnName("modified_by")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime>("ModifiedOn")
                        .HasColumnType("datetime")
                        .HasColumnName("modified_on");

                    b.Property<int>("ParentId")
                        .HasColumnType("int")
                        .HasColumnName("folder_id");

                    b.Property<int>("ThumbnailStatus")
                        .HasColumnType("int")
                        .HasColumnName("thumb");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("varchar(400)")
                        .HasColumnName("title")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("VersionGroup")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("version_group")
                        .HasDefaultValueSql("'1'");

                    b.HasKey("TenantId", "Id", "Version")
                        .HasName("PRIMARY");

                    b.HasIndex("Id")
                        .HasDatabaseName("id");

                    b.HasIndex("ModifiedOn")
                        .HasDatabaseName("modified_on");

                    b.HasIndex("ParentId")
                        .HasDatabaseName("folder_id");

                    b.ToTable("files_file", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFilesBunchObjects", b =>
                {
                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<string>("RightNode")
                        .HasColumnType("varchar(255)")
                        .HasColumnName("right_node")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("LeftNode")
                        .IsRequired()
                        .HasColumnType("varchar(255)")
                        .HasColumnName("left_node")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.HasKey("TenantId", "RightNode")
                        .HasName("PRIMARY");

                    b.HasIndex("LeftNode")
                        .HasDatabaseName("left_node");

                    b.ToTable("files_bunch_objects", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFilesLink", b =>
                {
                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<string>("SourceId")
                        .HasColumnType("varchar(32)")
                        .HasColumnName("source_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("LinkedId")
                        .HasColumnType("varchar(32)")
                        .HasColumnName("linked_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("LinkedFor")
                        .IsRequired()
                        .HasColumnType("char(38)")
                        .HasColumnName("linked_for")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.HasKey("TenantId", "SourceId", "LinkedId")
                        .HasName("PRIMARY");

                    b.HasIndex("TenantId", "SourceId", "LinkedId", "LinkedFor")
                        .HasDatabaseName("linked_for");

                    b.ToTable("files_link", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFilesSecurity", b =>
                {
                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<string>("EntryId")
                        .HasColumnType("varchar(50)")
                        .HasColumnName("entry_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("EntryType")
                        .HasColumnType("int")
                        .HasColumnName("entry_type");

                    b.Property<string>("Subject")
                        .HasColumnType("char(38)")
                        .HasColumnName("subject")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Owner")
                        .IsRequired()
                        .HasColumnType("char(38)")
                        .HasColumnName("owner")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("Share")
                        .HasColumnType("int")
                        .HasColumnName("security");

                    b.Property<DateTime>("TimeStamp")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("timestamp")
                        .HasColumnName("timestamp")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.HasKey("TenantId", "EntryId", "EntryType", "Subject")
                        .HasName("PRIMARY");

                    b.HasIndex("Owner")
                        .HasDatabaseName("owner");

                    b.HasIndex("TenantId", "EntryType", "EntryId", "Owner")
                        .HasDatabaseName("tenant_id");

                    b.ToTable("files_security", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFilesTag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(255)")
                        .HasColumnName("name")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Owner")
                        .IsRequired()
                        .HasColumnType("varchar(38)")
                        .HasColumnName("owner")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<int>("Type")
                        .HasColumnType("int")
                        .HasColumnName("flag");

                    b.HasKey("Id");

                    b.HasIndex("TenantId", "Owner", "Name", "Type")
                        .HasDatabaseName("name");

                    b.ToTable("files_tag", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFilesTagLink", b =>
                {
                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<int>("TagId")
                        .HasColumnType("int")
                        .HasColumnName("tag_id");

                    b.Property<string>("EntryId")
                        .HasColumnType("varchar(32)")
                        .HasColumnName("entry_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("EntryType")
                        .HasColumnType("int")
                        .HasColumnName("entry_type");

                    b.Property<int>("Count")
                        .HasColumnType("int")
                        .HasColumnName("tag_count");

                    b.Property<string>("CreateBy")
                        .HasColumnType("char(38)")
                        .HasColumnName("create_by")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime?>("CreateOn")
                        .HasColumnType("datetime")
                        .HasColumnName("create_on");

                    b.HasKey("TenantId", "TagId", "EntryId", "EntryType")
                        .HasName("PRIMARY");

                    b.HasIndex("CreateOn")
                        .HasDatabaseName("create_on");

                    b.HasIndex("TenantId", "EntryId", "EntryType")
                        .HasDatabaseName("entry_id");

                    b.ToTable("files_tag_link", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFilesThirdpartyAccount", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreateOn")
                        .HasColumnType("datetime")
                        .HasColumnName("create_on");

                    b.Property<string>("FolderId")
                        .HasColumnType("text")
                        .HasColumnName("folder_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("FolderType")
                        .HasColumnType("folder_type");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("varchar(100)")
                        .HasColumnName("password")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Provider")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("varchar(50)")
                        .HasColumnName("provider")
                        .HasDefaultValueSql("'0'")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("RootFolderType")
                        .HasColumnType("int")
                        .HasColumnName("root_folder_type");

                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("varchar(400)")
                        .HasColumnName("customer_title")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Token")
                        .HasColumnType("text")
                        .HasColumnName("token")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Url")
                        .HasColumnType("text")
                        .HasColumnName("url")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(38)")
                        .HasColumnName("user_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("varchar(100)")
                        .HasColumnName("user_name")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.HasKey("Id");

                    b.ToTable("files_thirdparty_account", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFilesThirdpartyApp", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("varchar(38)")
                        .HasColumnName("user_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("App")
                        .HasColumnType("varchar(50)")
                        .HasColumnName("app")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime>("ModifiedOn")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("timestamp")
                        .HasColumnName("modified_on")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<string>("Token")
                        .HasColumnType("text")
                        .HasColumnName("token")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.HasKey("UserId", "App")
                        .HasName("PRIMARY");

                    b.ToTable("files_thirdparty_app", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFilesThirdpartyIdMapping", b =>
                {
                    b.Property<string>("HashId")
                        .HasColumnType("char(32)")
                        .HasColumnName("hash_id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<string>("Id")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("id")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.HasKey("HashId")
                        .HasName("PRIMARY");

                    b.HasIndex("TenantId", "HashId")
                        .HasDatabaseName("index_1");

                    b.ToTable("files_thirdparty_id_mapping", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFolder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<string>("CreateBy")
                        .IsRequired()
                        .HasColumnType("char(38)")
                        .HasColumnName("create_by")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime>("CreateOn")
                        .HasColumnType("datetime")
                        .HasColumnName("create_on");

                    b.Property<int>("FilesCount")
                        .HasColumnType("int")
                        .HasColumnName("filesCount");

                    b.Property<int>("FolderType")
                        .HasColumnType("int")
                        .HasColumnName("folder_type");

                    b.Property<int>("FoldersCount")
                        .HasColumnType("int")
                        .HasColumnName("foldersCount");

                    b.Property<string>("ModifiedBy")
                        .IsRequired()
                        .HasColumnType("char(38)")
                        .HasColumnName("modified_by")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.Property<DateTime>("ModifiedOn")
                        .HasColumnType("datetime")
                        .HasColumnName("modified_on");

                    b.Property<int>("ParentId")
                        .HasColumnType("int")
                        .HasColumnName("parent_id");

                    b.Property<int>("TenantId")
                        .HasColumnType("int")
                        .HasColumnName("tenant_id");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("varchar(400)")
                        .HasColumnName("title")
                        .UseCollation("utf8_general_ci")
                        .HasAnnotation("MySql:CharSet", "utf8");

                    b.HasKey("Id");

                    b.HasIndex("ModifiedOn")
                        .HasDatabaseName("modified_on");

                    b.HasIndex("TenantId", "ParentId")
                        .HasDatabaseName("parent_id");

                    b.ToTable("files_folder", (string)null);
                });

            modelBuilder.Entity("ASC.Files.Core.EF.DbFolderTree", b =>
                {
                    b.Property<int>("ParentId")
                        .HasColumnType("int")
                        .HasColumnName("parent_id");

                    b.Property<int>("FolderId")
                        .HasColumnType("int")
                        .HasColumnName("folder_id");

                    b.Property<int>("Level")
                        .HasColumnType("int")
                        .HasColumnName("level");

                    b.HasKey("ParentId", "FolderId")
                        .HasName("PRIMARY");

                    b.HasIndex("FolderId")
                        .HasDatabaseName("folder_id");

                    b.ToTable("files_folder_tree", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
