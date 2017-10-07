module App.View exposing (render)

import Html exposing (Html, h2, button, nav, div, text, span, a, input, ul, li, node)
import Html.Attributes exposing (attribute, href, id, class)
import Html.Events exposing (onInput, onClick)
import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Routing
import Race.Model exposing (Race)
import Race.View.Add
import Race.View.List
import Race.View.Details
import Rider.View.List
import Rider.View.Details
import Result.View.List
import Result.View.Add
import Account.View
import Ui.Ratings
import Ui.Calendar

render : App -> Html Msg
render app =
    div []
        [ header app
        , mainView app
        ]


mainView : App -> Html Msg
mainView app =
    div [ class "container" ]
        [ viewPage app
        -- , Html.map Ratings (Ui.Ratings.view app.ratings)
        ]


viewPage : App -> Html Msg
viewPage app =
    case app.route of
        App.Routing.Home ->
            div []
                [ h2 [] [ text "Home" ]
                ]

        App.Routing.Riders ->
            case app.riders of
                Just riders ->
                    div []
                        [ h2 [] [ text "Riders" ]
                        , Rider.View.List.render riders
                        ]
                    {--
                    case app.races of
                        Just races ->
                            div []
                                [ h2 [] [ text "Riders" ]
                                , Rider.View.List.render riders app.results races
                                ]
                        Nothing ->
                            div [] [ text "No races loaded." ]
                    --}

                Nothing ->
                    div [] [ text "No riders loaded." ]

        App.Routing.RiderDetails id ->
            Rider.View.Details.render
                app
                id

        App.Routing.Races ->
            Race.View.List.render (app.account /= Nothing) (Maybe.withDefault [] app.races) app.results

        App.Routing.RaceDetails key ->
            Race.View.Details.render app key

        App.Routing.RaceAdd ->
            case app.account of
                -- Just _ ->
                Nothing ->
                    case app.page of
                        App.Model.RaceAdd raceAdd ->
                            div []
                                [ Race.View.Add.render raceAdd
                                ]

                        _ ->
                            div [] [ text "Page not RaceAdd" ]

                _ ->
                    div
                        []
                        [ text "Please log in." ]

        App.Routing.Results ->
            Result.View.List.render app.results

        App.Routing.ResultAdd raceId ->
            case app.account of
                Just _ ->
                    case app.page of
                        App.Model.ResultAdd resultAdd ->
                            let
                                maybeRace =
                                    getRace raceId (Maybe.withDefault [] app.races)
                            in
                                case maybeRace of
                                    Nothing ->
                                        div []
                                            [ text "Race does not exist. Adding result not possible." ]

                                    Just race ->
                                        case app.riders of
                                            Just riders ->
                                                div []
                                                    [ Result.View.Add.render race resultAdd riders app.results
                                                    ]

                                            Nothing ->
                                                div [] [ text "No riders loaded." ]

                        _ ->
                            div [] [ text "No resultAdd." ]
                Nothing ->
                    div
                        []
                        [ text "Please log in." ]

        App.Routing.AccountLogin ->
            Account.View.login app

        App.Routing.AccountLoginEmail email ->
            Account.View.login app

        App.Routing.Account ->
            Account.View.render app

        App.Routing.AccountSignup ->
            Account.View.signup app

        App.Routing.StravaCode maybeCode ->
            div [] []
            -- ( app, Cmd.none )
            --Account.View.stravaCode app


userLi : App -> List (Html App.Msg.Msg)
userLi app =
    case app.account of
        Just account ->
            let
                content =
                    case account.licence of
                        Just licence ->
                            [ text account.email ]

                        Nothing ->
                            [ text account.email
                            , span [ class "new badge" ] [ text "1" ]
                            ]
            in
                [ li [] [ a [ href "#races" ] [ text "Races" ] ]
                , li [] [ a [ href "#riders" ] [ text "Riders" ] ]
                , li [] [ a [ href "#account" ] content ]
                , li [] [ a [ onClick App.Msg.AccountLogoutSubmit ] [ text "Logout" ] ]
                ]

        Nothing ->
            [ li [] [ a [ href "#account/login" ] [ text "Login" ] ]
            , li [] [ a [ href "#account/signup" ] [ text "Signup" ] ]
            ]


header : App -> Html App.Msg.Msg
header app =
    nav []
        [ div
            [ class "nav-wrapper blue darken-4" ]
            [ a [ class "brand-logo left", href "#races" ] [ text "WRS" ]
            , ul
                [ id "nav-mobile", class "right" ]
                [ li [] [ a [ href "#races" ] [ text "Races" ] ]
                , li [] [ a [ href "#riders" ] [ text "Riders" ] ]
                ]
            ]
        ]


viewMessage : String -> Html msg
viewMessage reponse =
    div [] [ text reponse ]


getRace : String -> List Race.Model.Race -> Maybe Race.Model.Race
getRace raceKey races =
    List.head
        (List.filter
            (\race -> race.key == raceKey)
            races
        )
