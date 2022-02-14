﻿namespace ASC.Web.Core.Utility
{
    public interface IUrlShortener
    {
        string GetShortenLink(string shareLink);
    }

    [Scope]
    public class UrlShortener
    {
        public bool Enabled { get { return !(Instance is NullShortener); } }

        private IUrlShortener _instance;
        public IUrlShortener Instance
        {
            get
            {
                if (_instance == null)
                {
                    if (ConsumerFactory.Get<BitlyLoginProvider>().Enabled)
                    {
                        _instance = new BitLyShortener(ConsumerFactory);
                    }
                    else if (!string.IsNullOrEmpty(Configuration["web:url-shortener:value"]))
                    {
                        _instance = new OnlyoShortener(Configuration, CommonLinkUtility, MachinePseudoKeys, ClientFactory);
                    }
                    else
                    {
                        _instance = new NullShortener();
                    }
                }

                return _instance;
            }
            set
            {
                _instance = value;
            }
        }

        private IConfiguration Configuration { get; }
        private ConsumerFactory ConsumerFactory { get; }
        private CommonLinkUtility CommonLinkUtility { get; }
        private MachinePseudoKeys MachinePseudoKeys { get; }
        private IHttpClientFactory ClientFactory { get; }

        public UrlShortener(
            IConfiguration configuration,
            ConsumerFactory consumerFactory,
            CommonLinkUtility commonLinkUtility,
            MachinePseudoKeys machinePseudoKeys, 
            IHttpClientFactory clientFactory)
        {
            Configuration = configuration;
            ConsumerFactory = consumerFactory;
            CommonLinkUtility = commonLinkUtility;
            MachinePseudoKeys = machinePseudoKeys;
            ClientFactory = clientFactory;
        }
    }

    public class BitLyShortener : IUrlShortener
    {
        public BitLyShortener(ConsumerFactory consumerFactory)
        {
            ConsumerFactory = consumerFactory;
        }

        private ConsumerFactory ConsumerFactory { get; }

        public string GetShortenLink(string shareLink)
        {
            return ConsumerFactory.Get<BitlyLoginProvider>().GetShortenLink(shareLink);
        }
    }

    public class OnlyoShortener : IUrlShortener
    {
        private readonly string url;
        private readonly string internalUrl;
        private readonly byte[] sKey;

        private CommonLinkUtility CommonLinkUtility { get; }
        private IHttpClientFactory ClientFactory { get; }

        public OnlyoShortener(
            IConfiguration configuration,
            CommonLinkUtility commonLinkUtility,
            MachinePseudoKeys machinePseudoKeys,
            IHttpClientFactory clientFactory)
        {
            url = configuration["web:url-shortener:value"];
            internalUrl = configuration["web:url-shortener:internal"];
            sKey = machinePseudoKeys.GetMachineConstant();

            if (!url.EndsWith('/'))
                url += '/';
            CommonLinkUtility = commonLinkUtility;
            ClientFactory = clientFactory;
        }

        public string GetShortenLink(string shareLink)
        {
            var request = new HttpRequestMessage();
            request.RequestUri = new Uri(internalUrl + "?url=" + HttpUtility.UrlEncode(shareLink));
            request.Headers.Add("Authorization", CreateAuthToken());
            request.Headers.Add("Encoding", Encoding.UTF8.ToString());//todo check 

            var httpClient = ClientFactory.CreateClient();
            using var response = httpClient.Send(request);
            using var stream = response.Content.ReadAsStream();
            using var rs = new StreamReader(stream);
            return CommonLinkUtility.GetFullAbsolutePath(url + rs.ReadToEnd());
        }

        private string CreateAuthToken(string pkey = "urlShortener")
        {
            using var hasher = new HMACSHA1(sKey);
            var now = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var hash = Convert.ToBase64String(hasher.ComputeHash(Encoding.UTF8.GetBytes(string.Join("\n", now, pkey))));
            return $"ASC {pkey}:{now}:{hash}";
        }
    }

    public class NullShortener : IUrlShortener
    {
        public string GetShortenLink(string shareLink)
        {
            return null;
        }
    }
}
