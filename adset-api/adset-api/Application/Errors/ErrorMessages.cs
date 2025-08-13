namespace adset_api.Application.Errors
{
    public static class ErrorMessages
    {
        public static class Common
        {
            public const string InvalidPayload = "Payload inválido.";
            public const string UnexpectedError = "Ocorreu um erro inesperado.";
            public const string NotFound = "Recurso não encontrado.";
        }

        public static class Vehicle
        {
            public const string InvalidVehicle = "Veículo inválido.";
            public const string InvalidIdForQuery = "Id inválido para consulta.";
            public const string InvalidIdForUpdate = "Id inválido para atualização.";
            public const string InvalidIdForDelete = "Id inválido para exclusão.";
            public const string NotFound = "Veículo não encontrado.";
            public const string InvalidUpdateData = "Dados inválidos para atualização.";
            public const string MissingBrand = "Marca é obrigatória.";
            public const string MissingModel = "Modelo é obrigatório.";
            public const string MissingYear = "Ano é obrigatório.";
            public const string InvalidYearRange = "Ano deve estar entre 2000 e 2024.";
            public const string MissingLicensePlate = "Placa é obrigatória.";
            public const string MissingColor = "Cor é obrigatória.";
            public const string InvalidPrice = "Preço deve ser maior que zero.";
            public const string MaxPhotosExceeded = "Máximo de 15 fotos permitidas.";
            public static readonly string InvalidPortal = "Portal inválido.";
            public static readonly string InvalidPackageTier = "Pacote inválido para o portal selecionado.";
        }

        public static class Filter
        {
            public const string InvalidPriceRange = "Faixa de preço inválida. Use: '10-50', '50-90' ou '90+'.";
        }

        public static class Repository
        {
            public const string UpdateConcurrency = "Falha ao atualizar o registro. Ele pode ter sido modificado por outro processo.";
        }
    }
}