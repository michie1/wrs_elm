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
import Rider.View.Add
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
                    Rider.View.List.render riders

                Nothing ->
                    div [] [ text "No riders loaded." ]

        App.Routing.RiderDetails key ->
            Rider.View.Details.render app key

        App.Routing.RiderAdd ->
            case app.page of
                App.Model.RiderAdd add ->
                    div []
                        [ Rider.View.Add.render add
                        ]

                _ ->
                    div [] [ text "Page not RidersAdd" ]

        App.Routing.Races ->
            Race.View.List.render app.races app.results

        App.Routing.RaceDetails key ->
            Race.View.Details.render app key

        App.Routing.RaceAdd ->
            case app.page of
                App.Model.RaceAdd raceAdd ->
                    div []
                        [ Race.View.Add.render raceAdd
                        ]

                _ ->
                    div [] [ text "Page not RaceAdd" ]

        App.Routing.Results ->
            Result.View.List.render app.results

        App.Routing.ResultAdd raceId ->
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


userLi : App -> List (Html App.Msg.Msg)
userLi app =
    [ li [] [ a [ href "#races" ] [ text "Races" ] ]
    , li [] [ a [ href "#riders" ] [ text "Riders" ] ]
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
