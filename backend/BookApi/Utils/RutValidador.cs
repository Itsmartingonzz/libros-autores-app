using System.Linq;

namespace BookApi.Utils
{
    public static class RutValidator
    {
        public static bool EsRutValido(string rutConDv)
        {
            if (string.IsNullOrWhiteSpace(rutConDv)) return false;

            rutConDv = rutConDv.Replace(".", "").Replace("-", "").ToUpper();

            if (rutConDv.Length < 2) return false;

            string rut = rutConDv[..^1];
            char dv = rutConDv[^1];

            if (!int.TryParse(rut, out int rutNumerico)) return false;

            int suma = 0;
            int multiplicador = 2;

            foreach (char c in rut.Reverse())
            {
                suma += (c - '0') * multiplicador;
                multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
            }

            int resto = 11 - (suma % 11);
            char dvEsperado = resto switch
            {
                11 => '0',
                10 => 'K',
                _ => (char)('0' + resto)
            };

            return dv == dvEsperado;
        }
    }
}
