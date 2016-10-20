module App.View exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
import Html.App
import App.Msg exposing (Msg(..))
import App.Model exposing (App, Mdl)
import App.Page
import Riders.Model exposing (Rider)
import Races.Model exposing (Race)
import Races.Add
import Races.List
import Races.Details
import Riders.List
import Riders.Details
import Riders.Add
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
                        ]
                    ]
                ]

        App.Page.Riders ->
            div []
                [ Riders.List.render app.riders app.mdl
                ]   
    
        App.Page.RidersAdd ->
            div []
                [ Riders.Add.render app.riderAdd.rider app.mdl
                ]


        App.Page.RidersDetails id ->
            div []
                [ Riders.Details.render 
                    (List.head 
                        (List.filter 
                            (\rider -> rider.id == id)
                            app.riders
                        )
                    ) 
                    app.mdl
                ]

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

        App.Page.RacesAdd ->
            div []
                [ Races.Add.render app.raceAdd.race app.mdl
                ]


