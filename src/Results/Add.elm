module Results.Add exposing (render)

import Html exposing (Html, button, div, text, span, label, input, ul, li, h2, input, i)
import Html.Attributes exposing (class, id, type_, for)
import Html.Events exposing (onInput, onClick)
import Json.Decode as Json
--import Material.Button as Button
--import Material.Textfield as Textfield
--import Material.Typography as Typo
--import Material.Options as Options exposing (css)
import App.Msg
import Results.Model
import Races.Model
import Riders.Model exposing (Rider)


render : Races.Model.Race -> Results.Model.ResultAdd -> List Rider -> List Results.Model.Result -> Html App.Msg.Msg
render race resultAdd riders results =
    div []
        [ h2 [] [ text ("Add result for " ++ race.name) ]
        , div []
            [ div [ class "row" ]
                [ div [ class "input-field col s6" ]
                    [ input [ id "result", type_ "text", onInput App.Msg.SetResultAddResult ] []
                    , label [ for "result" ] [ text "Result" ]
                    ]
                ]
            , div [ class "row" ]
                [ div [ class "input-field col s6" ]
                    [ input
                        [ id "date"
                        , type_ "text"
                        , onInput App.Msg.SetResultRiderName
                        , class "autocomplete"
                        ]
                        []
                    , label [ for "date" ] [ text "Rider" ]
                    ]
                ]
            ]
        , div []
            [ selectRider riders race results
            ]
        , div [ class "row" ]
            [ button
                [ class "waves-effect waves-light btn"
                , type_ "submit"
                , onClick App.Msg.AddResult
                , Html.Attributes.name "action"
                --, disabled submitDisabled
                ]
                [ text "Add result"
                , i [ class "material-icons right" ] [ text "send" ]
                ]
            ]
        ]


resultExists : List Results.Model.Result -> Races.Model.Race -> Riders.Model.Rider -> Bool
resultExists results race rider =
    List.length
        (List.filter
            (\result -> race.id == result.raceId && rider.id == result.riderId)
            results
        )
        == 1


selectRider : List Riders.Model.Rider -> Races.Model.Race -> List Results.Model.Result -> Html App.Msg.Msg
selectRider allRiders race results =
    div []
        [ Html.select
            [ onSelect App.Msg.ResultAddSetRiderId ]
            (List.map
                (\rider ->
                    (Html.option
                        [ (Html.Attributes.value (toString rider.id))
                          -- , ( Html.Attributes.disabled ( resultExists results race rider ) )
                        ]
                        [ text rider.name ]
                    )
                )
                --riders
                allRiders
            )
        ]


targetSelectedIndex : Json.Decoder Int
targetSelectedIndex =
    Json.at [ "target", "selectedIndex" ] Json.int


onSelect : (Int -> msg) -> Html.Attribute msg
onSelect msg =
    Html.Events.on "change" (Json.map msg targetSelectedIndex)
