///////////////////////////////////////////////////////////////images/////////////////////////////////////////////////////////////////////////////
export const imagesList = {
    appLogo: { src: require('../assets/image/logo.png'), alt: 'logo.png' },
    profile: { src: require('../assets/image/undraw_profile.png'), alt: 'undraw_profile.png' },
    employee_default_img: {src: require('../assets/image/profile.png')},

}

///////////////////////////////////////////////////////////////active colors/////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////Date Formate/////////////////////////////////////////////////////////////////////////////
export const DateFormatCard = 'MMMM D, YYYY, h A';

export const add_task=`add_task`; 
export const create_new_work_space=`create_new_work_space`; 
export const filter_and_sort=`filter_and_sort`;
export const add_project = `add_project`;
export const add_project_module = `add_project_module`;
export const file_upload = "file_upload";
export const add_time_sheet="add_time_sheet"
export const delete_notification = "delete_notification";
export const add_meeting_link="add_meeting_link"
export const ROLES = [
    {role: "Employee", short_name: "employee", id:1},
    {role: "Admin", short_name: "admin", id:2},
    {role: "Manager", short_name: "manager", id:3}
]

export const MENU = [
    "Profile",
    "Settings",
    "Activity Log"
]

export const WEEKS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

export const INCOME = "Income"
export const EXPENSE = "Expense"
export const NET_DIFFERENCE = "Net Difference"
export const APP_NAME = ""
export const UN_AUTHORIZED = "UNAUTHORIZED"
export const AUTHORIZED = "AUTHORIZED"
export const MULTIPART = "AUTHORIZED"
export const UPLOAD_FILE = "Upload file"
export const DATE = "Date"

export const svgIcons = (style = "", icon) => {
    const icons = {
        upload: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" className={style}>
            <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z" />
        </svg>,
        attachment: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" className={style}>
            <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
        </svg>,
        arrow: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" className={style}>
            <path d="M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3V480c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128z" /></svg>
    }
    return icons[icon]
}
export const locale_dict_currency = {
    "INR": "en_IN",
    "RUB": "ru_RU",
    "GBP": "en_GB",
    "USD": "en_US",
    "AZN": "az_AZ",
    "AUD": "en_AU",
    "AWG": "nl_AW",
    "ARS": "es_AR",
    "AFN": "ps_AF",
    "ALL": "sq_AL",
    "BRL": "pt_BR",
    "BGN": "bg_BG",
    "BWP": "en_BW",
    "BAM": "bs_BA",
    "BOB": "es_BO",
    "BMD": "en_BM",
    "BZD": "en_BZ",
    "BYR": "be_BY",
    "BBD": "en_BB",
    "BSD": "en_BS",
    "CUP": "es_CU",
    "HRK": "hr_HR",
    "CRC": "es_CR",
    "COP": "es_CO",
    "CNY": "zh_CN",
    "CLP": "es_CL",
    "KYD": "en_KY",
    "CAD": "en_CA",
    "KHR": "km_KH",
    "BND": "ms_Latn_BN",
    "GHS": "ak_GH",
    "FJD": "en_FJ",
    "FKP": "en_FK",
    "EUR": "de_DE",
    "SVC": "es_SV",
    "EGP": "ar_EG",
    "XCD": "en_AG",
    "DOP": "es_DO",
    "DKK": "da_DK",
    "CZK": "cs_CZ",
    "LAK": "lo_LA",
    "KGS": "ky_KG",
    "KRW": "ko_KR",
    "KPW": "ko_KP",
    "KZT": "kk_KZ",
    "JEP": "en_JE",
    "JPY": "ja_JP",
    "JMD": "en_JM",
    "ILS": "he_IL",
    "IMN": "gv_IM",
    "IRR": "fa_IR",
    "IDR": "id_ID",
    "ISK": "is_IS",
    "HUF": "hu_HU",
    "HKD": "zh_HK",
    "HNL": "es_HN",
    "GYD": "en_GY",
    "GBP": "en_GG",
    "GTQ": "es_GT",
    "GIP": "en_GI",
    "PYG": "es_PY",
    "PAB": "es_PA",
    "PKR": "ur_PK",
    "OMR": "ar_OM",
    "NOK": "nb_NO",
    "NGN": "en_NG",
    "NIO": "es_NI",
    "NZD": "en_NZ",
    "ANG": "nl_SX",
    "NPR": "ne_NP",
    "NAD": "naq_NA",
    "MZN": "mgh_MZ",
    "MAD": "ar_MA",
    "MNT": "mn_MN",
    "MXN": "es_MX",
    "MUR": "mfe_MU",
    "MYR": "ms_MY",
    "MKD": "mk_MK",
    "LRD": "vai_Vaii_LR",
    "LBP": "ar_LB",
    "TWD": "zh_TW",
    "SYP": "ar_SY",
    "SRD": "nl_SR",
    "CHF": "de_CH",
    "SEK": "sv_SE",
    "LKR": "si_LK",
    "ZAR": "en_ZA",
    "SOS": "so_SO",
    "SBD": "en_SB",
    "SGD": "zh_SG",
    "SCR": "en_SC",
    "RSD": "sr_RS",
    "SAR": "ar_SA",
    "SHP": "en_SH",
    "RON": "ro_RO",
    "QAR": "ar_QA",
    "PLN": "pl_PL",
    "PHP": "fil_PH",
    "PEN": "es_PE",
    "ZWD": "nd_ZW",
    "YER": "ar_YE",
    "VND": "vi_VN",
    "VEF": "es_VE",
    "UZS": "uz_UZ",
    "UYU": "es_UY",
    "AED": "ar_AE",
    "UAH": "ru_UA",
    "TVD": "en_TV",
    "TRY": "tr_TR",
    "TTD": "en_TT",
    "THB": "th_TH"
}
export const currencyData = [
    {
        "name": "UAE-Dirham",
        "currency_code": "AED",
        "symbol": " د.إ"
    },
    {
        "name": "Afghanistan Afghani",
        "currency_code": "AFN",
        "symbol": "؋"
    },
    {
        "name": "Albania Lek",
        "currency_code": "ALL",
        "symbol": "Lek"
    },
    {
        "name": "Netherlands Antilles Guilder",
        "currency_code": "ANG",
        "symbol": "ƒ"
    },
    {
        "name": "Argentine Peso",
        "currency_code": "ARS",
        "symbol": "$"
    },
    {
        "name": "Australian Dollar",
        "currency_code": "AUD",
        "symbol": "$"
    },
    {
        "name": "Aruba Guilder",
        "currency_code": "AWG",
        "symbol": "ƒ"
    },
    {
        "name": "Azerbaijan Manat",
        "currency_code": "AZN",
        "symbol": "₼"
    },
    {
        "name": "Bosnia and Herzegovina Convertible Mark",
        "currency_code": "BAM",
        "symbol": "KM"
    },
    {
        "name": "Barbados Dollar",
        "currency_code": "BBD",
        "symbol": "$"
    },
    {
        "name": "Bulgarian Lev",
        "currency_code": "BGN",
        "symbol": "лв."
    },
    {
        "name": "Bermudian Dollar",
        "currency_code": "BMD",
        "symbol": "$"
    },
    {
        "name": "Brunei Darussalam Dollar",
        "currency_code": "BND",
        "symbol": "$"
    },
    {
        "name": "Bolivia Bolíviano",
        "currency_code": "BOB",
        "symbol": "$b"
    },
    {
        "name": "Brazilian Real",
        "currency_code": "BRL",
        "symbol": "R$"
    },
    {
        "name": "Bahamas Dollar",
        "currency_code": "BSD",
        "symbol": "$"
    },
    {
        "name": "Botswana Pula",
        "currency_code": "BWP",
        "symbol": "P"
    },
    {
        "name": "Belarus Ruble",
        "currency_code": "BYN",
        "symbol": "Br"
    },
    {
        "name": "Belize Dollar",
        "currency_code": "BZD",
        "symbol": "BZ$"
    },
    {
        "name": "Canadian Dollar",
        "currency_code": "CAD",
        "symbol": "$"
    },
    {
        "name": "Switzerland Franc",
        "currency_code": "CHF",
        "symbol": "CHF"
    },
    {
        "name": "Chilean Peso",
        "currency_code": "CLP",
        "symbol": "$"
    },
    {
        "name": "China Yuan Renminbi",
        "currency_code": "CNY",
        "symbol": "¥"
    },
    {
        "name": "Colombian Peso",
        "currency_code": "COP",
        "symbol": "$"
    },
    {
        "name": "Costa Rica Colon",
        "currency_code": "CRC",
        "symbol": "₡"
    },
    {
        "name": "Cuba Peso",
        "currency_code": "CUP",
        "symbol": "₱"
    },
    {
        "name": "Czech Koruna",
        "currency_code": "CZK",
        "symbol": "Kč"
    },
    {
        "name": "Danish Krona",
        "currency_code": "DKK",
        "symbol": "kr"
    },
    {
        "name": "Dominican Republic Peso",
        "currency_code": "DOP",
        "symbol": "RD$"
    },
    {
        "name": "Egyptian Pound",
        "currency_code": "EGP",
        "symbol": "£"
    },
    {
        "name": "Euro Member Countries",
        "currency_code": "EUR",
        "symbol": "€"
    },
    {
        "name": "Fiji Dollar",
        "currency_code": "FJD",
        "symbol": "$"
    },
    {
        "name": "Falkland Islands (Malvinas) Pound",
        "currency_code": "FKP",
        "symbol": "£"
    },
    {
        "name": "Pound sterling",
        "currency_code": "GBP",
        "symbol": "£"
    },
    {
        "name": "Guernsey Pound",
        "currency_code": "GGP",
        "symbol": "£"
    },
    {
        "name": "Ghana Cedi",
        "currency_code": "GHS",
        "symbol": "¢"
    },
    {
        "name": "Gibraltar Pound",
        "currency_code": "GIP",
        "symbol": "£"
    },
    {
        "name": "Guatemala Quetzal",
        "currency_code": "GTQ",
        "symbol": "Q"
    },
    {
        "name": "Guyana Dollar",
        "currency_code": "GYD",
        "symbol": "$"
    },
    {
        "name": "Hong Kong Dollar",
        "currency_code": "HKD",
        "symbol": "圓"
    },
    {
        "name": "Honduras Lempira",
        "currency_code": "HNL",
        "symbol": "L"
    },
    {
        "name": "Croatian kuna",
        "currency_code": "HRK",
        "symbol": "kn"
    },
    {
        "name": "Hungarian Forint",
        "currency_code": "HUF",
        "symbol": "Ft"
    },
    {
        "name": "Indonesian Rupiah",
        "currency_code": "IDR",
        "symbol": "Rp"
    },
    {
        "name": "Israeli Shekel",
        "currency_code": "ILS",
        "symbol": "₪"
    },
    {
        "name": "Isle of Man Pound",
        "currency_code": "IMP",
        "symbol": "£"
    },
    {
        "name": "Indian rupee",
        "currency_code": "INR",
        "symbol": "₹"
    },
    {
        "name": "Iran Rial",
        "currency_code": "IRR",
        "symbol": "﷼"
    },
    {
        "name": "Iceland Krona",
        "currency_code": "ISK",
        "symbol": "kr"
    },
    {
        "name": "Jersey Pound",
        "currency_code": "JEP",
        "symbol": "£"
    },
    {
        "name": "Jamaican Dollar",
        "currency_code": "JMD",
        "symbol": "$"
    },
    {
        "name": "Japanese Yen",
        "currency_code": "JPY",
        "symbol": "¥"
    },
    {
        "name": "Kyrgyzstan Som",
        "currency_code": "KGS",
        "symbol": "лв"
    },
    {
        "name": "Cambodia Riel",
        "currency_code": "KHR",
        "symbol": "៛"
    },
    {
        "name": "Korea (North) Won",
        "currency_code": "KPW",
        "symbol": "₩"
    },
    {
        "name": "South Korean won",
        "currency_code": "KRW",
        "symbol": "₩"
    },
    {
        "name": "Cayman Islands Dollar",
        "currency_code": "KYD",
        "symbol": "$"
    },
    {
        "name": "Tenge",
        "currency_code": "KZT",
        "symbol": "₸"
    },
    {
        "name": "Laos Kip",
        "currency_code": "LAK",
        "symbol": "₭"
    },
    {
        "name": "Lebanon Pound",
        "currency_code": "LBP",
        "symbol": "£"
    },
    {
        "name": "Sri Lanka Rupee",
        "currency_code": "LKR",
        "symbol": "₨"
    },
    {
        "name": "Liberia Dollar",
        "currency_code": "LRD",
        "symbol": "$"
    },
    {
        "name": "Macedonia Denar",
        "currency_code": "MKD",
        "symbol": "ден"
    },
    {
        "name": "Mongolia Tughrik",
        "currency_code": "MNT",
        "symbol": "₮"
    },
    {
        "name": "Mauritius Rupee",
        "currency_code": "MUR",
        "symbol": "₨"
    },
    {
        "name": "Mexico Peso",
        "currency_code": "MXN",
        "symbol": "$"
    },
    {
        "name": "Malaysia Ringgit",
        "currency_code": "MYR",
        "symbol": "RM"
    },
    {
        "name": "Mozambique Metical",
        "currency_code": "MZN",
        "symbol": "MT"
    },
    {
        "name": "Namibia Dollar",
        "currency_code": "NAD",
        "symbol": "$"
    },
    {
        "name": "Nigerian Naira",
        "currency_code": "NGN",
        "symbol": "₦"
    },
    {
        "name": "Nicaragua Cordoba",
        "currency_code": "NIO",
        "symbol": "C$"
    },
    {
        "name": "Norwegian Krona",
        "currency_code": "NOK",
        "symbol": "kr"
    },
    {
        "name": "Nepal Rupee",
        "currency_code": "NPR",
        "symbol": "₨"
    },
    {
        "name": "New-Zealand Dollar",
        "currency_code": "NZD",
        "symbol": "$"
    },
    {
        "name": "Oman Rial",
        "currency_code": "OMR",
        "symbol": "﷼"
    },
    {
        "name": "Panama Balboa",
        "currency_code": "PAB",
        "symbol": "B/."
    },
    {
        "name": "Peru Sol",
        "currency_code": "PEN",
        "symbol": "S/."
    },
    {
        "name": "Philippines Peso",
        "currency_code": "PHP",
        "symbol": "₱"
    },
    {
        "name": "Pakistan Rupee",
        "currency_code": "PKR",
        "symbol": "₨"
    },
    {
        "name": "Polish Zloty",
        "currency_code": "PLN",
        "symbol": "Pł"
    },
    {
        "name": "Paraguay Guarani",
        "currency_code": "PYG",
        "symbol": "Gs"
    },
    {
        "name": "Qatar Riyal",
        "currency_code": "QAR",
        "symbol": "﷼"
    },
    {
        "name": "Romania Leu",
        "currency_code": "RON",
        "symbol": "lei"
    },
    {
        "name": "Serbia Dinar",
        "currency_code": "RSD",
        "symbol": "Дин."
    },
    {
        "name": "Russia Ruble",
        "currency_code": "RUB",
        "symbol": "₽"
    },
    {
        "name": "Saudi Riyal",
        "currency_code": "SAR",
        "symbol": "﷼"
    },
    {
        "name": "Solomon Islands Dollar",
        "currency_code": "SBD",
        "symbol": "$"
    },
    {
        "name": "Seychelles Rupee",
        "currency_code": "SCR",
        "symbol": "₨"
    },
    {
        "name": "Sweden Krona",
        "currency_code": "SEK",
        "symbol": "kr"
    },
    {
        "name": "Singapore Dollar",
        "currency_code": "SGD",
        "symbol": "$"
    },
    {
        "name": "Saint Helena Pound",
        "currency_code": "SHP",
        "symbol": "£"
    },
    {
        "name": "Somalia Shilling",
        "currency_code": "SOS",
        "symbol": "S"
    },
    {
        "name": "Suriname Dollar",
        "currency_code": "SRD",
        "symbol": "$"
    },
    {
        "name": "El Salvador Colon",
        "currency_code": "SVC",
        "symbol": "$"
    },
    {
        "name": "Syria Pound",
        "currency_code": "SYP",
        "symbol": "£"
    },
    {
        "name": "Thai Baht",
        "currency_code": "THB",
        "symbol": "฿"
    },
    {
        "name": "Turkish Lira",
        "currency_code": "TRY",
        "symbol": "TL"
    },
    {
        "name": "Trinidad and Tobago Dollar",
        "currency_code": "TTD",
        "symbol": "TT$"
    },
    {
        "name": "Tuvalu Dollar",
        "currency_code": "TVD",
        "symbol": "$"
    },
    {
        "name": "Taiwan Dollar",
        "currency_code": "TWD",
        "symbol": "$"
    },
    {
        "name": "Ukrainian Hryvnia",
        "currency_code": "UAH",
        "symbol": "₴"
    },
    {
        "name": "United States Dollar",
        "currency_code": "USD",
        "symbol": "$"
    },
    {
        "name": "Uruguay Peso",
        "currency_code": "UYU",
        "symbol": "$U"
    },
    {
        "name": "Uzbekistan Som",
        "currency_code": "UZS",
        "symbol": "лв"
    },
    {
        "name": "Venezuela Bolívar",
        "currency_code": "VEF",
        "symbol": "Bs"
    },
    {
        "name": "Viet Nam Dong",
        "currency_code": "VND",
        "symbol": "₫"
    },
    {
        "name": "East Caribbean Dollar",
        "currency_code": "XCD",
        "symbol": "$"
    },
    {
        "name": "Yemen Rial",
        "currency_code": "YER",
        "symbol": "﷼"
    },
    {
        "name": "South Africa Rand",
        "currency_code": "ZAR",
        "symbol": "R"
    },
    {
        "name": "Zimbabwe Dollar",
        "currency_code": "ZWD",
        "symbol": "Z$"
    }
]