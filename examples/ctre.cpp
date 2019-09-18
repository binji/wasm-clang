#include <ctre.hpp>
#include <string_view>
#include <optional>

using namespace std::literals;

static constexpr auto pattern = ctll::fixed_string{"(\\d{4})/(\\d{1,2})/(\\d{1,2})"};

struct date { std::string_view year; std::string_view month; std::string_view day; };

constexpr std::optional<date> extract_date(std::string_view s) noexcept {
    using namespace ctre::literals;
    if (auto [whole, year, month, day] = ctre::match<pattern>(s); whole) {
        return date{year, month, day};
    } else {
        return std::nullopt;
    }
}

static_assert(extract_date("2018/08/27"sv).has_value());
static_assert((*extract_date("2018/08/27"sv)).year == "2018"sv);
static_assert((*extract_date("2018/08/27"sv)).month == "08"sv);
static_assert((*extract_date("2018/08/27"sv)).day == "27"sv);

int main() {}
