module App.View exposing (render)

import Html exposing (Html, h2, button, nav, div, text, span, a, input, ul, li, node)
import Html.Attributes exposing (attribute, href, id, class)
import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Routing
import Races.Model exposing (Race)
import Races.Add
import Races.List
import Races.Details
import Riders.List
import Riders.Details
import Riders.Add
import Results.List
import Results.Add
import Comments.Add
import Account.View


userLi : App -> List (Html App.Msg.Msg)
userLi app =
    case app.account of
        Just account ->
            let 
                content = case account.licence of 
                            Just licence -> 
                                [ text account.name ]

                            Nothing ->
                                [ text account.name
                                , span [ class "new badge" ] [ text "1" ]
                                ]
            in
                [ li [] [ a [ href "#account" ] content ]
                ]
                -- [ text account.name ] ]

        Nothing ->
            [ li [] [ a [ href "#account/login" ] [ text "Login" ] ]
            , li [] [ a [ href "#account/signup" ] [ text "Signup" ] ]
            ]


header : App -> Html App.Msg.Msg
header app =
    nav []
        [ div
            [ class "nav-wrapper blue darken-4" ]
            [ a [ class "brand-logo left", href "#home" ] [ text "WRS" ]
            , ul [ id "nav-mobile", class "right" ]
                (List.concat
                    [ (userLi app)
                    --, [ li [] [ a [ href "#races" ] [ text "Races" ] ]
                      -- , li [] [ a [ href "#riders" ] [ text "Riders" ] ]
                    --  ]
                    ]
                )
            ]
        ]


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
        ]


viewPage : App -> Html Msg
viewPage app =
    case app.route of
        App.Routing.Home ->
            div []
                [ h2 [] [ text "Home" ]
                ]

        App.Routing.Riders ->
            div []
                [ Riders.List.render app.riders
                ]

        App.Routing.RidersAdd ->
            div []
                [ Riders.Add.render app.riderAdd.rider
                ]

        App.Routing.RidersDetails id ->
            div []
                [ Riders.Details.render
                    app
                    id
                ]

        App.Routing.Races ->
            div []
                [ Races.List.render app.races app.results
                ]

        App.Routing.RacesDetails id ->
            div []
                [ Races.Details.render
                    app
                    id
                ]

        App.Routing.RacesAdd ->
            case app.raceAdd of
                Nothing ->
                    div [] [ text "RaceAdd nothing" ]

                Just raceAdd ->
                    div []
                        [ Races.Add.render raceAdd
                        ]

        App.Routing.Results ->
            div []
                [ Results.List.render app.results
                ]

        App.Routing.ResultsAdd raceId ->
            case app.resultAdd of
                Just resultAdd ->
                    let
                        maybeRace =
                            getRace raceId app.races
                    in
                        case maybeRace of
                            Nothing ->
                                div []
                                    [ text "Race does not exist. Adding result not possible." ]

                            Just race ->
                                div []
                                    [ Results.Add.render race resultAdd app.riders app.results
                                    ]

                Nothing ->
                    div [] [ text "No resultAdd." ]

        App.Routing.CommentAdd raceId ->
            let
                maybeRace =
                    getRace raceId app.races
            in
                case maybeRace of
                    Nothing ->
                        div []
                            [ text "Race does not exist. Adding comment not possible." ]

                    Just race ->
                        div []
                            [ Comments.Add.render app race app.riders
                            ]

        App.Routing.AccountLogin ->
            Account.View.login app

        App.Routing.AccountLoginName name ->
            Account.View.login app

        App.Routing.AccountLogout ->
            Account.View.logout app

        App.Routing.Account ->
            Account.View.render app

        App.Routing.AccountSignup ->
            Account.View.signup app


getRace : Int -> List Races.Model.Race -> Maybe Races.Model.Race
getRace raceId races =
    List.head
        (List.filter
            (\race -> race.id == raceId)
            races
        )
