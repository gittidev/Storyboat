import React from "react"

interface SearchBarProps {
    value? : string;
    onChange? : (event : React.ChangeEvent<HTMLInputElement>) => void 
}

export function SearchBar({value, onChange} : SearchBarProps){
    return (
        <>
        <input
        type="search"
        placeholder="검색하기"
        value={value}
        onChange={onChange}
        />
        </>
    )
}


interface Country {
    code: string;
    en: string;
    ko: string;
}

interface SearchResultsProps {
    countries: Country[];
    searching: boolean;
}


export function SearchResults({ countries, searching }: SearchResultsProps) {
    return (
        <article aria-busy={searching}>
            {searching ? (
                "잠시만 기다려주세요. 국가를 검색하고 있습니다."
            ) : (
                <>
                    <header>총 {countries.length}개의 국가가 검색되었습니다.</header>
                    <ul>
                        {countries.map(({ code, en, ko }) => (
                            <li key={code}>
                                {ko} ({en})
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </article>
    );
}