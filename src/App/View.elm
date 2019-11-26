module App.View exposing (view)

import App.Model exposing (App)
import App.Msg
import App.Page
import Data.Race exposing (Race, getRace, lastRaces)
import Data.RaceResult exposing (RaceResult)
import Data.Rider exposing (Rider)
import Data.User exposing (User)
import Html exposing (Html, a, aside, button, div, h2, li, p, section, text, ul)
import Html.Attributes exposing (class, href, target)
import Html.Events exposing (onClick)
import Page.Race.Add.View
import Page.Race.Details
import Page.Race.List
import Page.Result.Add.View
import Page.Result.Edit.View
import Page.Rider.Add.View
import Page.Rider.Details
import Page.Rider.List


view : App -> Html App.Msg.Msg
view app =
    div [ class "container" ]
        [ loadingPage app
        ]


mainView : App -> List Race -> List Rider -> List RaceResult -> Maybe User -> String -> Html App.Msg.Msg
mainView app races riders results maybeUser wtosLoginUrl =
    div [ class "columns" ]
        [ section [ class "section", class "column", class "is-one-fifth" ] [ sidebar races maybeUser wtosLoginUrl ]
        , section [ class "section", class "column" ] [ viewPage app races riders results ]
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
            Page.Race.Add.View.view raceAdd
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
            div [ class "col s9 m8 offset-s3 offset-m4" ]
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



-- div [ class "loader" ] [ text "Loading..." ]


sidebar : List Race -> Maybe User -> String -> Html App.Msg.Msg
sidebar races maybeUser wtosLoginUrl =
    aside [ class "menu" ]
        [ p [ class "menu-label" ] [ a [ href "https://wtos.nl", target "_blank" ] [ text "WTOS.nl" ] ]
        , p [ class "menu-label" ] [ a [ href "#races" ] [ text "Races" ] ]
        , ul [ class "menu-list" ] (List.map raceLi <| lastRaces races)
        , p [ class "menu-label" ] [ a [ href "#riders" ] [ text "Riders" ] ]
        , userUl maybeUser wtosLoginUrl
        , p [ class "menu-label" ] [ a [ href "https://github.com/michie1/wrs_elm", target "_blank" ] [ text "WRS on GitHub" ] ]
        ]


userUl : Maybe User -> String -> Html App.Msg.Msg
userUl maybeUser wtosLoginUrl =
    div []
        [ p [ class "menu-label" ] [ text "User" ]
        , ul [ class "menu-list" ] <|
            case maybeUser of
                Just user ->
                    [ li [] [ a [ href "#" ] [ text user.email ] ]
                    , li [] [ button [ class "button", onClick App.Msg.UserSignOut ] [ text "Sign out" ] ]
                    ]

                Nothing ->
                    [ li [] [ a [ href wtosLoginUrl ] [ text "Sign in" ] ] ]
        ]


raceLi : Race -> Html App.Msg.Msg
raceLi race =
    li [] [ a [ href ("#races/" ++ race.key) ] [ text race.name ] ]
