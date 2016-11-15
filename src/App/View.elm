module App.View exposing (render)

import Html exposing (Html, button, nav, div, text, span, a, input, ul, li)
import Html.Attributes exposing (href, id, class)
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


--import Material.Scheme

--import Material.Options as Options exposing (css)
--import Material.Typography as Typo
--import Material.Layout as Layout
import Util


header : App -> Html App.Msg.Msg
header app =
    nav []
        [ div
            [ class "nav-wrapper" ]
            [ a [ class "brand-logo left", href "#home" ] [ text "WRS" ]
            , ul [ id "nav-mobile", class "right" ]
                [ li [] [ a [ href "#races" ] [ text "Races" ] ]
                , li [] [ a [ href "#riders" ] [ text "Riders" ] ]
                , li [] [ a [ href "#results" ] [ text "Results" ] ]
                  --, li [ ] [ a [ href "#" ] [ text "Reset" ] ]
                ]
            ]
        ]


render : App -> Html Msg
render app =
    div []
        []
        {--
        [ Layout.render Mdl
            app.mdl
            [ Layout.fixedHeader ]
            { header =
                [ header app ]
                --header app ]
            , drawer = []
            , tabs = ( [], [] )
            , main = [ mainView app ]
            }
        ]
        --}


--|> Material.Scheme.top


mainView : App -> Html Msg
mainView app =
    div [] [ viewPage app ]


viewPage : App -> Html Msg
viewPage app =
    case app.route of
        App.Routing.Home ->
            div []
                [ div []
                    [ div []
                        []
                        {--[ Options.styled Html.p
                            [ Typo.display2 ]
                            [ text "HOME" ]
                            ]--}
                    ]
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
                [ Races.List.render app.races
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

                -- crash?
                Just raceAdd ->
                    div []
                        [ Races.Add.render raceAdd
                        ]

        App.Routing.Results ->
            div []
                [ Results.List.render app.results
                ]

        App.Routing.ResultsAdd raceId ->
            let
                maybeRace =
                    getRace raceId app.races

                --resultAdd = Util.fromJust app.resultAdd
                resultAdd =
                    case app.resultAdd of
                        Nothing ->
                            Debug.crash "resultAdd shouldn't be Nothing in App.Routing.ResultsAdd."

                        Just value ->
                            value
            in
                case maybeRace of
                    Nothing ->
                        --Navigation.newUrl (App.Page.toHash app.page)
                        --App.Msg.GoTo app.page
                        div []
                            [ text "Race does not exist. Adding result not possible." ]

                    Just race ->
                        div []
                            [ Results.Add.render race resultAdd app.riders app.results 
                            ]

        App.Routing.CommentAdd raceId ->
            let
                maybeRace =
                    getRace raceId app.races

                commentAdd =
                    Util.fromJust app.commentAdd
            in
                case maybeRace of
                    Nothing ->
                        --Navigation.newUrl (App.Page.toHash app.page)
                        --App.Msg.GoTo app.page
                        div []
                            [ text "Race does not exist. Adding comment not possible." ]

                    Just race ->
                        div []
                            [ Comments.Add.render commentAdd race app.riders
                            ]


getRace : Int -> List Races.Model.Race -> Maybe Races.Model.Race
getRace raceId races =
    List.head
        (List.filter
            (\race -> race.id == raceId)
            races
        )
