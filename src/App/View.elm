module App.View exposing (view)

import App.Model exposing (App)
import App.Msg
import App.Page
import Browser exposing (Document)
import Data.Race exposing (Race, getRace, lastRaces)
import Data.RaceResult exposing (RaceResult)
import Data.Rider exposing (Rider)
import Data.User exposing (User)
import Html exposing (Html, a, aside, button, div, h2, li, p, section, span, text, ul)
import Html.Attributes exposing (class, classList, href, target)
import Html.Events exposing (onClick)
import Page.Race.Add.View
import Page.Race.Details
import Page.Race.List
import Page.Result.Add.View
import Page.Result.Edit.View
import Page.Rider.Add.View
import Page.Rider.Details
import Page.Rider.List


view : App -> Document App.Msg.Msg
view app =
    { title = "WTOS Uitslagen"
    , body =
        [ div [ class "container" ]
            [ loadingPage app
            ]
        ]
    }


mainView : App -> List Race -> List Rider -> List RaceResult -> Maybe User -> String -> Html App.Msg.Msg
mainView app races riders results maybeUser wtosLoginUrl =
    div []
        [ mobileNavToggle app.mobileMenuOpen
        , mobileOverlay app.mobileMenuOpen
        , div [ class "columns" ]
            [ section
                [ classList
                    [ ( "section", True )
                    , ( "column", True )
                    , ( "is-one-fifth", True )
                    , ( "is-active", app.mobileMenuOpen )
                    ]
                ]
                [ sidebar races maybeUser wtosLoginUrl app.mobileMenuOpen ]
            , section [ class "section", class "column", class "is-four-fifths" ]
                [ backButton app.page
                , viewPage app races riders results
                ]
            ]
        ]


viewPage : App -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
viewPage app races riders results =
    case app.page of
        App.Page.RiderDetails key ->
            Page.Rider.Details.view app key races riders results

        App.Page.Riders ->
            Page.Rider.List.view riders races results

        App.Page.RiderAdd add ->
            Page.Rider.Add.View.view add
                |> Html.map App.Msg.RiderAdd

        App.Page.RaceDetails key ->
            Page.Race.Details.view app key races riders results

        App.Page.Races ->
            Page.Race.List.view races results

        App.Page.RaceAdd raceAdd ->
            Page.Race.Add.View.view raceAdd app.now
                |> Html.map App.Msg.RaceAdd

        App.Page.ResultAdd add ->
            let
                maybeRace =
                    getRace add.raceKey races
            in
            case maybeRace of
                Just race ->
                    Page.Result.Add.View.view race add riders results
                        |> Html.map App.Msg.ResultAdd

                Nothing ->
                    div [] [ text "Race does not exist." ]

        App.Page.ResultEdit edit ->
            Page.Result.Edit.View.view edit
                |> Html.map App.Msg.ResultEdit


loadingPage : App -> Html App.Msg.Msg
loadingPage app =
    case ( app.races, app.riders, app.results ) of
        ( Just races, Just riders, Just results ) ->
            mainView app races riders results app.user app.wtosLoginUrl

        ( _, _, _ ) ->
            div [ class "section" ]
                [ h2 [ class "title is-2" ] [ text "Loading data" ]
                , spinner
                ]


spinner : Html App.Msg.Msg
spinner =
    div [ class "spinner" ]
        [ div [ class "bounce1" ] []
        , div [ class "bounce2" ] []
        , div [ class "bounce3" ] []
        ]


sidebar : List Race -> Maybe User -> String -> Bool -> Html App.Msg.Msg
sidebar races maybeUser wtosLoginUrl mobileMenuOpen =
    aside [ class "menu" ]
        [ p [ class "menu-label" ] [ a [ href "https://wtos.nl", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "WTOS.nl" ] ]
        , p [ class "menu-label" ] [ a [ href "/races", onClick App.Msg.CloseMobileMenu ] [ text "Races" ] ]
        , ul [ class "menu-list" ] (List.map raceLi <| lastRaces races)
        , p [ class "menu-label" ] [ a [ href "/riders", onClick App.Msg.CloseMobileMenu ] [ text "Riders" ] ]
        , userUl maybeUser wtosLoginUrl
        , p [ class "menu-label" ] [ a [ href "https://uitslagen.wtos.nl/2024/", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "Uitslagen 2024" ] ]
        , p [ class "menu-label" ] [ a [ href "https://uitslagen.wtos.nl/2023/", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "Uitslagen 2023" ] ]
        , p [ class "menu-label" ] [ a [ href "https://uitslagen.wtos.nl/2022/", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "Uitslagen 2022" ] ]
        , p [ class "menu-label" ] [ a [ href "https://uitslagen.wtos.nl/2021/", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "Uitslagen 2021" ] ]
        , p [ class "menu-label" ] [ a [ href "https://uitslagen.wtos.nl/2020/", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "Uitslagen 2020" ] ]
        , p [ class "menu-label" ] [ a [ href "https://uitslagen.wtos.nl/2019/", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "Uitslagen 2019" ] ]
        , p [ class "menu-label" ] [ a [ href "https://uitslagen.wtos.nl/2018/", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "Uitslagen 2018" ] ]
        , p [ class "menu-label" ] [ a [ href "https://github.com/michie1/wrs_elm", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "GitHub" ] ]
        , p [ class "menu-label" ] [ a [ href "https://msvos.nl", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "App nodig?" ] ]
        , p [ class "menu-label" ] [ a [ href "https://msvos.nl", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "© msvos" ] ]
        ]


userUl : Maybe User -> String -> Html App.Msg.Msg
userUl maybeUser wtosLoginUrl =
    div []
        [ p [ class "menu-label" ] [ text "User" ]
        , ul [ class "menu-list" ] <|
            case maybeUser of
                Just user ->
                    [ li [] [ a [ href "/" ] [ text user.email ] ]
                    , li [] [ button [ class "button", onClick App.Msg.UserSignOut ] [ text "Sign out" ] ]
                    ]

                Nothing ->
                    [ li [] [ a [ href wtosLoginUrl ] [ text "Sign in" ] ] ]
        ]


mobileNavToggle : Bool -> Html App.Msg.Msg
mobileNavToggle isOpen =
    button
        [ classList
            [ ( "mobile-nav-toggle", True )
            , ( "is-active", isOpen )
            ]
        , onClick App.Msg.ToggleMobileMenu
        ]
        [ text
            (if isOpen then
                "×"

             else
                "☰"
            )
        ]


mobileOverlay : Bool -> Html App.Msg.Msg
mobileOverlay isOpen =
    if isOpen then
        div
            [ class "mobile-overlay"
            , onClick App.Msg.CloseMobileMenu
            ]
            []

    else
        text ""


backButton : App.Page.Page -> Html App.Msg.Msg
backButton currentPage =
    case currentPage of
        App.Page.Races ->
            text ""

        App.Page.Riders ->
            text ""

        _ ->
            button
                [ class "back-button"
                , onClick App.Msg.GoBack
                ]
                [ text "← Back" ]


raceLi : Race -> Html App.Msg.Msg
raceLi race =
    li [] [ a [ href ("/races/" ++ race.key), onClick App.Msg.CloseMobileMenu ] [ text race.name ] ]
