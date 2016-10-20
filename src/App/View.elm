module App.View exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
import Html.App
import App.Msg exposing (Msg(..))
import App.Model exposing (App, Rider, Mdl)
import App.Page
import Race.Model exposing (Race)
import RaceAdd.View
import Races.List
import Races.Details
import ViewRiders exposing (viewRiders)
import Material.Scheme
import Material.Options as Options exposing (css)
import Material.Typography as Typo
import Material.Layout as Layout
import Material.Textfield as Textfield


render : App -> Html Msg
render app =
    div []
        [ Layout.render Mdl
            app.mdl
            [ Layout.fixedHeader ]
            { header =
                [ Layout.row []
                    [ Layout.title []
                        [ Layout.link
                            [ Layout.href "#home" ]
                            [ text "WRS" ]
                        ]
                    , Layout.navigation []
                        [ Layout.link
                            [ Layout.href "#races" ]
                            [ text "Races" ]
                        , Layout.link
                            [ Layout.href "#riders" ]
                            [ text "Riders" ]
                        , Layout.link
                            [ Layout.href "#races/add" ]
                            [ text "Add race" ]
                        , Layout.link
                            [ Layout.href "#races/1" ]
                            [ text "Race 1" ]
                        ]
                    ]
                ]
            , drawer = []
            , tabs = ( [], [] )
            , main = [ mainView app ]
            }
        ]
        |> Material.Scheme.top


mainView : App -> Html Msg
mainView app =
    div [] [ viewPage app ]


viewPage : App -> Html Msg
viewPage app =
    case app.page of
        App.Page.Home ->
            div []
                [ div []
                    [ div []
                        [ Options.styled Html.p
                            [ Typo.display2 ]
                            [ text "HOME" ]
                        , viewRider app
                        ]
                    ]
                ]

        App.Page.Riders ->
            viewRiders app.riders

        App.Page.Races ->
            div []
                [ Races.List.render app.races app.mdl
                ]

        App.Page.RacesDetails id ->
            div []
                [ Races.Details.render 
                    (List.head 
                        (List.filter 
                            (\race -> race.id == id)
                            app.races
                        )
                    ) 
                    app.mdl
                ]

        App.Page.RaceAddPage ->
            div []
                [ RaceAdd.View.render app.raceAdd.race app.mdl
                ]


viewRider : App -> Html Msg
viewRider app =
    div []
        [ div [] [ text "Naam: " ]
        , div [] [ text app.rider.name ]
        , div [] [ text "Licentie: " ]
        , div [] [ text app.rider.licence ]
        ]
