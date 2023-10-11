///////////////////////////////////////////////////////////////images/////////////////////////////////////////////////////////////////////////////
export const imagesList = {
    appLogo: { src: require('../assets/image/logo.png'), alt: 'logo.png' },
    profile: { src: require('../assets/image/undraw_profile.png'), alt: 'undraw_profile.png' },
    employee_default_img: {src: require('../assets/image/profile.png')},

}

///////////////////////////////////////////////////////////////active colors/////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////Date Formate/////////////////////////////////////////////////////////////////////////////
export const DateFormatCard = 'MMMM D, YYYY, h:mm A';

export const add_task=`add_task`; 
export const create_new_work_space=`create_new_work_space`; 
export const filter_and_sort=`filter_and_sort`;
export const add_project = `add_project`;
export const add_project_module = `add_project_module`;
export const file_upload = "file_upload";
export const add_time_sheet="add_time_sheet"
export const delete_notification = "delete_notification";
export const add_meeting_link="add_meeting_link"
export const add_effort = "add_efforts"
export const TASK = "Task"
export const DURATION = "Duration"
export const STATUS="Status"
export const START_TIME = "Start Time"
export const END_TIME = "End Time"
export const PROJECT = "Project"
export const EMPLOYEE = "Employee"
export const MODULE = "Module"
export const ALERTS="Alerts"
export const MAPPING="mapping"
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
            <path d="M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3V480c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128z" /></svg>,
        timer: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={style}>
        <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>,
        close: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" className={style}>
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>,
        search: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={style}>
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>,
        delete: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" className={style}>
            <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
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